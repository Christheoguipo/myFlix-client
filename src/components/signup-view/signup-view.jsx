import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";

export const SignupView = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      Email: email,
      Password: password,
      Birthday: birthday
    };

    fetch("https://retro-movie-vault-5ccf6999c998.herokuapp.com/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        console.log({ data });
        alert("Signup successful!");
        window.location.reload();
      })
      .catch((e) => {
        console.log(error);
        alert("Error occurred during signup.");
      });
  };

  return (
    <>
      <Col className="d-flex flex-column justify-content-center align-center" md={3}>

        <h1 className="align-self-center pb-5">MovieVault</h1>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formSignupUsername">
            {/* <Form.Label>Username:</Form.Label> */}
            <Form.Control
              className="mb-3"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength="3"
            />
          </Form.Group>

          <Form.Group controlId="formSignupPassword">
            {/* <Form.Label>Password:</Form.Label> */}
            <Form.Control
              className="mb-3"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            {/* <Form.Label>Email:</Form.Label> */}
            <Form.Control
              className="mb-3"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBirthday">
            {/* <Form.Label>Birthday:</Form.Label> */}
            <Form.Control
              className="mb-3"
              type="date"
              placeholder="Birthday (dd/mm/yyyy)"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button className="mt-2" variant="primary" type="submit">Signup</Button>
            <Link className="align-self-end" to={"/login"}>
              Already have an account? Click here.
            </Link>
          </div>
        </Form>
      </Col>
    </>
  );

}
