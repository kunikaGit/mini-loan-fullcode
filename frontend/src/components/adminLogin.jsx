import React, { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import config from "../config/config";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your admin login API endpoint
      const response = await axios.post(`${config.apiurl}admin/adminLogin`, {
        email,
        password,
      });

      // Handle the response accordingly (you might want to redirect or show a success message)
      if (response.data.status) {
        // Redirect or show success message
        navigate(`${config.baseUrl}user-list`);
      } else {
        // Handle login failure, e.g., show an error message
        console.error("Admin login failed:", response.data.message);
      }
    } catch (error) {
      // Handle errors, e.g., show an error message to the user
      console.error("Error logging in as admin:", error.message);
    }
  };

  return (
    <>
      <section>
        <Container>
          <Row>
            <Col md={3}></Col>
            <Col md={6}>
              <div className="upper-box">
                <div className="login-box">
                  <h2>Admin Login</h2>
                  <form>
                    <label>Email</label>
                    <input
                      type="text"
                      placeholder="Enter Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>Password</label>
                    <input
                      type="password" // Change to password input type for security
                      placeholder="Enter Your Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="primary" onClick={handleLogin}>
                      Login
                    </Button>
                    <div className="another-login">
                      <Link to={`${config.baseUrl}`}>
                        <a>User Login</a>
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </Col>
            <Col md={3}></Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default AdminLogin;
