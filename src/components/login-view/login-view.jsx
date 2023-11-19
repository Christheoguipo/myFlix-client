import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "../../redux/reducers/user";
import { Link, useLocation } from "react-router-dom";
import { Alert } from "react-bootstrap";

export const LoginView = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const [alertVariant, setAlertVariant] = useState("success");
  const [alertShow, setAlertShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const alertProperties = (variant, show, message) => {
    setAlertVariant(variant);
    setAlertShow(show);
    setAlertMessage(message);
  }


  const location = useLocation();
  useEffect(() => {

    if (location.state && location.state.message) {
      alertProperties("success", true, location.state.message);
    }
  }, [location.state]);


  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      Password: password
    };

    fetch("https://retro-movie-vault-5ccf6999c998.herokuapp.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
          dispatch(setUser(data.user));
          dispatch(setToken(data.token));
        } else {
          alertProperties("danger", true, "No such user.")
        }
      })
      .catch((e) => {
        alertProperties("danger", true, "Something went wrong.")
      });
  };

  return (
    <>

      <Col className="d-flex flex-column justify-content-center align-center" xl={4} lg={5} md={7}>

        <h1 className="align-self-center pb-5">MovieVault</h1>
        <Alert variant={alertVariant} show={alertShow} onClose={() => setAlertShow(false)} dismissible>
          {alertMessage}
        </Alert>
        <Form onSubmit={handleSubmit}>

          <Form.Group controlId="formUsername">
            {/* <Form.Label>Username:</Form.Label> */}
            <Form.Control
              className="mb-3"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => { setUsername(e.target.value) }}
              minLength="4"
              required
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            {/* <Form.Label>Password:</Form.Label> */}
            <Form.Control
              className="mb-3"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="primary" type="submit">Login</Button>
            <Link className="align-self-end" to={"/signup"}>
              Don't have an account? Click here.
            </Link>
          </div>

        </Form>
      </Col >
    </>
  );
};