
const { validationResult } = require('express-validator');
const User = require('../Models/User');
const LoanRequest = require('../Models/loanRequest')

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const email = req.body.email;
        const password = req.body.password
        const role='user'
     

        const user = await User.findOne({ email });
        if (user == null) {
            const newUser = await User({
                email,
                password,
                role
            })
            await newUser.save();
            return res.status(200).send({ status: true, data: newUser._id, message: "New user register" });

        }
        return res.status(200).send({ status: true, data: user._id, message: "Login successfully" });


    } catch (error) {
        return res.status(200).send({ status: false, data: [], message: error });
    }

}

exports.createLoanRequest = async (req, res) => {
    try {
        const { amount, term, userId } = req.body;

        const intervalDays = 7; 
        const currentDate = Date.now(); 
        
        const scheduledRepayments = calculateScheduledRepayments(amount, term, currentDate, intervalDays);

        const newLoanRequest = new LoanRequest({
            userId,
            amount,
            term,
            date: currentDate,
            intervalDays,
            scheduledRepayments,
            status: 'PENDING',
        });

        const savedLoanRequest = await newLoanRequest.save();

        res.status(201).send({ status: true, data: savedLoanRequest, message: "Loan inserted" });
    } catch (error) {
        console.error('Error creating loan request:', error);
        res.status(500).json({ status: false, data: null, message: "Internal Server Error" });
    }
};

function calculateScheduledRepayments(amount, term, date, intervalDays) {
    const scheduledRepayments = [];
    const repaymentAmount = amount / term;

    for (let i = 0; i < term; i++) {
        const repaymentDate = new Date(date);
        repaymentDate.setDate(repaymentDate.getDate() + i * intervalDays);

        scheduledRepayments.push({
            date: repaymentDate.toISOString().split('T')[0], // Format date as string
            amount: repaymentAmount,
            status: 'PENDING',
        });
    }

    return scheduledRepayments;
}

exports.getUserLoans = async (req, res) => {
    try {
        const userId = req.body.userId;  // Assuming userId is part of the route parameters

        const userLoans = await LoanRequest.find({ userId });

        if (!userLoans) {
            return res.status(404).json({ status: false, data: null, message: 'No loans found for the user' });
        }

        res.status(200).json({ status: true, data: userLoans, message: 'User loans retrieved successfully' });
    } catch (error) {
        console.error('Error fetching user loans:', error);
        res.status(500).json({ status: false, data: null, message: 'Internal Server Error' });
    }
};

exports.payInstallment = async (req, res) => {
    
    try {
        const userId = req.body.userId;  // Assuming userId is part of the route parameters
        const amount = parseInt(req.body.amount);
        const instalmentId = parseInt(req.body.term);
        const userLoans = await LoanRequest.find({ userId });

       if(instalmentId-1>=0){
         if( userLoans[0].scheduledRepayments[instalmentId-1].status == 'PENDING'){
            return res.status(200).json({ status: false, message: 'Previouse Installment is pending' });
        }
    }
        const scheduledRepayment = userLoans[0].scheduledRepayments[instalmentId];

        if (!scheduledRepayment) {
            return res.status(400).json({ status: false, message: 'Invalid instalmentId' });
        }

        if (scheduledRepayment.amount > amount) {
            return res.status(200).json({ status: false, message: 'Instalment amount is less than repayment amount' });
        }



    // Update the status of the specified installment to "PAID"
    scheduledRepayment.status = "PAID";

    // Update amountReturned and instalmentsPaid
    
    userLoans[0].amountReturned += amount;
    userLoans[0].instalmentsPaid += 1;

   const termsToUpdate =  userLoans[0].instalmentsPaid;
             //1
   const totalAmountPaid = userLoans[0].amountReturned;
           //25
   const balanceToPay = userLoans[0].amount-totalAmountPaid
           //75               //100-25
   const balanceTerm = userLoans[0].term - termsToUpdate
           //3                 //4-1
   let newAmountToPay = balanceToPay/balanceTerm;//75/3
        //25
    // Update pending schedules with the remaining amount
    for (let i = termsToUpdate; i < userLoans[0].scheduledRepayments.length; i++) {

        userLoans[0].scheduledRepayments[i].amount = newAmountToPay
        if(newAmountToPay==0){
            userLoans[0].scheduledRepayments[i].status = 'PAID'
            userLoans[0].status='PAID'
        }
        
    }
    if(instalmentId == userLoans[0].scheduledRepayments.length-1){
        userLoans[0].status='PAID'
    }
    await userLoans[0].save();
      return res.status(200).json({ status: true, message: 'Instalment payment successful' });


   } catch (error) {
        console.error('Error fetching user loans:', error);
        res.status(500).json({ status: false, data: null, message: 'Internal Server Error' });
    }
};

