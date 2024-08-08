import React, { useState } from "react";
import { Button, Container, Form, Alert } from "react-bootstrap";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import './LoginPage.css';  // Make sure to create this CSS file

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="login-container p-4 rounded shadow">
        <h1 className="my-3 text-center">Login to your account</h1>
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
              <a href="/signup" className="text-decoration-none">Sign up for an account</a>
            </div>
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}

          <Button 
            variant="primary" 
            className="w-100"
            onClick={async (e) => {
              setError("");
              const canLogin = username && password;
              if (canLogin)
                try {
                  await signInWithEmailAndPassword(auth, username, password);
                  navigate("/");
                } catch (error) {
                  setError(error.message);
                }
            }}
          >
            Login
          </Button>
        </Form>
      </div>
    </Container>
  );
}
