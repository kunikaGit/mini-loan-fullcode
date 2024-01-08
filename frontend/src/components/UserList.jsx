import React, { useState, useEffect } from "react";
import { Button, Container, Row } from "react-bootstrap";
import Table from 'react-bootstrap/Table';
import axios from "axios";
import Cookies from "js-cookie";
import config from "../config/config";
import { useNavigate } from 'react-router-dom';
const ActionBtn = ({data}) =>{
    const handleApprove = () => {

        const loanRequestId = data._id;
    
        // Call the API to approve the loan request
        axios.post(`${config.apiurl}admin/approveLoanRequest`, {
          loanRequestId,
        })
        .then(response => {
           
          if (response.data.status) {
            window.location.reload()
          } else {
            console.error("Error approving loan request:", response.data.message);
          }
        })
        .catch(error => {
          console.error("Error approving loan request:", error.message);
        });
      };
    
      return (
        <>
          <div className="action-btn">
            <Button variant="primary" onClick={handleApprove}>
              Approve
            </Button>
          </div>
        </>
      );
}
const UserList = () => {

  const [userLoans, setUserLoans] = useState([]);
  const navigate = useNavigate();

    useEffect(() => {
        fetchUserLoans();
    
      }, []);

      const fetchUserLoans = async () => {
        try {
          const response = await axios.get(`${config.apiurl}admin/getAllLoanRequests`);
    
          // Log the fetched data to the console
          if(response.data.status){
            setUserLoans(response.data.data)
          };
    
        } catch (error) {
          console.error("Error fetching user loans:", error.message);
        }
      };
      const logout=(e)=>{
        e.preventDefault();
        navigate(`${config.baseUrl}`);
    
      }
    return (
        <>
            <section>
                <Container>
                    <Row>
                        <h2 className="main-heading">User List</h2>
                        
                       {userLoans.length>0 ?
                        <Table >
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>User Id</th>
                                    <th>Amount</th>
                                    <th>Term</th>
                                    <th>Date</th>
                                    <th>Status</th>

                                </tr>
                            </thead>
                            <tbody>
                                
                               {userLoans.map((item,index)=>(
                                <tr>
                                    <td>{index +1}</td>
                                    <td>{item.userId}</td>
                                    <td>{item.amount}</td>
                                    <td>{item.term}</td>
                                    <td>{item.date}</td>
                                    <td>{item.status=='PENDING'?<ActionBtn data={item}/>:`${item.status}`}</td>
                                    
                                </tr>
                               )) }
                               
                            </tbody>
                        </Table>
                        :
                        <p>No User Applied for loan</p>}
                    </Row>
                </Container>
                <Button className="logout" onClick={e=>{logout(e)}}>LOGOUT</Button>
            </section>
        </>
    )
}
export default UserList;