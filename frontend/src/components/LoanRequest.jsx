import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import config from "../config/config";
import { useNavigate } from 'react-router-dom';

const LoanRequest = () => {
  const [userLoans, setUserLoans] = useState([]);
  
  const [amount,setAmount] = useState();
  const [term,setTerm] = useState()
  const [refresh,setRefresh] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserLoans();

  }, [refresh]); // The empty dependency array ensures that this effect runs only once when the component mounts
  // Fetch user loans when the component mounts
  const fetchUserLoans = async () => {
    try {
      const userId = Cookies.get("userId"); // Assuming you have stored userId in cookies
      const response = await axios.post(`${config.apiurl}getUserLoans`, {
        userId,
      });

      // Log the fetched data to the console
      if(response.data.status){

      for(let i=0;i<response.data.data[0].scheduledRepayments.length;i++){
        response.data.data[0].scheduledRepayments[i].changeAmount =  response.data.data[0].scheduledRepayments[i].amount
      }

        setUserLoans(response.data.data)
      };

    } catch (error) {
      console.error("Error fetching user loans:", error.message);
    }
  };
  const submitLoanRequest = async (e) => {
    e.preventDefault()
    try {
      const userId = Cookies.get("userId"); // Assuming you have stored userId in cookies

      const response = await axios.post(`${config.apiurl}loanRequest`, {
        userId,
        amount,
        term
      });

      // Log the fetched data to the console
      if(response.data.status){
      console.log(response)

       // setUserLoans(response.data.data)
      };

    } catch (error) {
      console.error("Error fetching user loans:", error.message);
    }
  };

  const changePayment=(e,item)=>{
    let localData = [...userLoans]; // Create a shallow copy of the state array
    let newValue=parseInt(e.target.value)
    if(isNaN(parseInt(e.target.value))){
        newValue=0
    }
    localData[0].scheduledRepayments[item].changeAmount = newValue;
    setUserLoans(localData);
  }
  const logout=(e)=>{
    e.preventDefault();
    navigate(`${config.baseUrl}`);

  }
  
  const payInstallments = async (e, index, amount) => {
    e.preventDefault();
  
    try {
      // Fetch userId from cookies
      const userId = Cookies.get("userId");
  
      // Make a POST request to the payInstallment API endpoint
      const response = await axios.post(`${config.apiurl}payInstallment`, {
        userId,
        amount,
        term: index , 
      });
  
      // Handle the response accordingly
      if (response.data.status) {
        setRefresh(true)
        console.log("Installment payment successful!");
        // You might want to update the UI or show a success message
      } else {
        console.error("Installment payment failed:", response.data.message);
        // Handle payment failure, e.g., show an error message to the user
      }
    } catch (error) {
      console.error("Error paying installment:", error.message);
      // Handle errors, e.g., show an error message to the user
    }
  };
  return (
    <>
    <section>
        <Container>
            {userLoans.length == 0 && <Row>
                <Col md={6}>
                    <h2 className="main-heading">Loan Request</h2>
                    <div className="shadow-box">
                        <h4>Required Filled for loan</h4>
                        <form>
                            <label>Loan Amount</label>
                            <input type="number" placeholder="Enter Loan Amount"
                            onChange={e=>{setAmount(e.target.value)}} value={amount} />
                            <label>Term</label>
                            <input type="number" placeholder="Enter Term"
                            onChange={e=>{setTerm(e.target.value)}} value={term} />
                            <Button variant="primary" onClick={e=>{submitLoanRequest(e)}}>Submit</Button>
                        </form>
                    </div>
                </Col>
            </Row>}
            
            {userLoans.length>0 &&  
             <> 
             <Row className="mt-3">
              <Col md={6}>
                  <div className="shadow-box">
                      <h4>Your Loan Detail</h4>
                      <ul>
                          <li>Amount Requested : {userLoans[0].amount}</li>
                          <li>Total terms: {userLoans[0].term}</li>
                          <li>Loan requested date: {new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(userLoans[0].date)}</li>
                          <li>Amount Paid : {userLoans[0].amountReturned}</li>
                          <li>Terms Completed : {userLoans[0].instalmentsPaid}</li>
                          <li>Status :{userLoans[0].status} </li>
                      </ul>
                  </div>
              </Col>
          </Row>
            {(userLoans.length>0 && (userLoans[0].status=='APPROVED' || userLoans[0].status=='PAID')) &&
            <Row className="mt-2">
                <Col md={12}>
                    <div className="shadow-box">
                        <h3> Installment Status</h3>
              
                <Table>
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userLoans[0].scheduledRepayments.map((loan, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{loan.date}</td>
                        <td>{loan.amount}</td>
                        <td>{loan.status}</td>
          
                        <td>
                        <div className="pay-loan">
                        { loan.status=='PENDING'? <><input onChange={e=>{changePayment(e,index)}} value={loan.changeAmount}></input><Button variant="primary" onClick={e=>{payInstallments(e,index,loan.changeAmount)}}>Pay</Button></>:`${loan.status}`}
                        </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>}
          </>}
        </Container>
        <Button className="logout" onClick={e=>{logout(e)}}>LOGOUT</Button>

      </section>
    </>
  );
};

export default LoanRequest;
