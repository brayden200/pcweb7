import React, { useState } from "react";
import { Button, Container, Form, Alert, Row, Col } from "react-bootstrap";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import './SignUpPage.css';

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100 login-bg">
      <Row className="w-100">
        <Col xs={12} md={6} lg={4} className="mx-auto">
          <div className="login-container p-4 rounded shadow">
            <h1 className="my-3 text-center">Sign up for an account</h1>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="text-end">
                  <a href="/login" className="text-decoration-none">Have an existing account? Login here.</a>
                </div>
              </Form.Group>

              {error && <Alert variant="danger">{error}</Alert>}

              <Button 
                variant="primary" 
                className="w-100 btn-custom"
                onClick={async (e) => {
                  setError("");
                  const canSignup = username && password;
                  if (canSignup)
                    try {
                      await createUserWithEmailAndPassword(auth, username, password);
                      navigate("/");
                    } catch (error) {
                      setError(error.message);
                    }
                }}
              >
                Sign Up
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
