const User = require('../Models/User');
const LoanRequest = require('../Models/loanRequest')
const { validationResult } = require('express-validator');

/**
 * Get all loan requests
 */
exports.getAllLoanRequests = async (req, res) => {
    try {
        // Fetch all loan requests from the database
        const allLoanRequests = await LoanRequest.find();

        // Return the list of loan requests
        res.status(200).json({ status: true, data: allLoanRequests, message: 'All loan requests retrieved successfully' });
    } catch (error) {
        // Handle errors if any occur during the process
        console.error('Error fetching all loan requests:', error);
        res.status(500).json({ status: false, data: null, message: 'Internal Server Error' });
    }
};

/**
 * Approve a loan request
 */
exports.approveLoanRequest = async (req, res) => {
    try {
        const loanRequestId = req.body.loanRequestId;  // Assuming loanRequestId is part of the route parameters

        // Find the loan request by ID and update its status to 'APPROVED'
        const loanRequest = await LoanRequest.findByIdAndUpdate(
            loanRequestId,
            { $set: { status: 'APPROVED' } },
            { new: true }  // Return the modified document
        );

        // Check if the loan request was not found
        if (!loanRequest) {
            return res.status(404).json({ status: false, data: null, message: 'Loan request not found' });
        }

        // Return the approved loan request
        res.status(200).json({ status: true, data: loanRequest, message: 'Loan request approved successfully' });
    } catch (error) {
        // Handle errors if any occur during the process
        console.error('Error approving loan request:', error);
        res.status(500).json({ status: false, data: null, message: 'Internal Server Error' });
    }
};


exports.adminLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const email = req.body.email;
        const password = req.body.password
        const role='admin'
     

        const user = await User.findOne({ email });
        if (user == null) {
            const newUser = await User({
                email,
                password,
                role
            })
            await newUser.save();
            return res.status(200).send({ status: true, data: newUser._id, message: "admin register" });

        }
        return res.status(200).send({ status: true, data: user._id, message: "Login successfully" });


    } catch (error) {
        return res.status(200).send({ status: false, data: [], message: error });
    }

}