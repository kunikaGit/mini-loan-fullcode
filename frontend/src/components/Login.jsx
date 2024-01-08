import React, { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import axios from "axios";
import Cookies from "js-cookie";
import config from "../config/config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to your login API endpoint
      const response = await axios.post(`${config.apiurl}login`, {
        email,
        password,
      });

      // Handle the response accordingly (you might want to store user data in state or context)
      if (response.data.status) {
        Cookies.set("userId", response.data.data);
        navigate(`${config.baseUrl}loan-request`);
      }
    } catch (error) {
      // Handle errors, e.g., show an error message to the user
      console.error("Error logging in:", error.message);
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
                  <h2>User Login</h2>
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
                      type="password"
                      placeholder="Enter Your Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="primary" onClick={(e) => handleLogin(e)}>
                      Login
                    </Button>
                    <div className="another-login">
                      <Link to={`${config.baseUrl}admin-login`}>
                        <a>Admin Login</a>
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

export default Login;
