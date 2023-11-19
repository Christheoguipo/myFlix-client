import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import Button from "react-bootstrap/Button";
import { MovieCard } from "../movie-card/movie-card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "../../redux/reducers/user";
import Form from "react-bootstrap/Form";
import { Alert, Modal } from "react-bootstrap";

export const ProfileView = ({ user, token, movies }) => {

  const navigate = useNavigate();

  const { usernameParam } = useParams();
  const isUser = user.Username === usernameParam;

  if (!isUser) {
    navigate("/");
  }

  const dispatch = useDispatch();

  // Commented out to get the user from the mainview instead
  // const user = users.find((user) => user.Username === usernameParam);

  const favoriteMovies = movies.filter((movie) => user.FavoriteMovies.includes(movie._id));
  const formattedDate = new Date(user.Birthday).toISOString().substring(0, 10);

  const [username, setUsername] = useState(user.Username);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(user.Email);
  const [birthday, setBirthday] = useState(formattedDate);


  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  const handleUpdateModalShow = () => setUpdateModalShow(true);
  const handleUpdateModalClose = () => setUpdateModalShow(false)
  const handleDeleteModalShow = () => setDeleteModalShow(true);
  const handleDeleteModalClose = () => setDeleteModalShow(false);

  const [alertVariant, setAlertVariant] = useState("success");
  const [alertShow, setAlertShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const alertProperties = (variant, show, message) => {
    setAlertVariant(variant);
    setAlertShow(show);
    setAlertMessage(message);
  }

  const handleProfileUpdateSubmit = (event) => {
    event.preventDefault();

    handleUpdateModalShow();

  };

  const handleConfirmUpdate = () => {
    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday
    };

    fetch(`https://retro-movie-vault-5ccf6999c998.herokuapp.com/users/${user.Username}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {

        if (data) {

          alertProperties("success", true, "User successfully updated.")

          dispatch(setUser(null));
          dispatch(setToken(null));
          localStorage.clear();
          handleUpdateModalClose();

        } else {
          alertProperties("danger", true, "No such user.")
        }
      })
      .catch((e) => {
        console.log(e);
        alertProperties("danger", true, "Error occurred during user update.")
      });
  }

  const handleDeregisterSubmit = (event) => {
    event.preventDefault();

    handleDeleteModalShow();
  }

  const handleConfirmDelete = () => {

    fetch(`https://retro-movie-vault-5ccf6999c998.herokuapp.com/users/${user.Username}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        return response;
      })
      .then((data) => {

        if (data) {

          alertProperties("success", true, "User successfully deregistered.")

          dispatch(setUser(null));
          dispatch(setToken(null));
          localStorage.clear();

          handleDeleteModalClose();

        } else {
          alertProperties("danger", true, "No such user.")
        }
      })
      .catch((e) => {
        console.log(e);
        alertProperties("danger", true, "Error occurred during user deregister.")
      });
  }

  return (
    <>
      <Alert variant={alertVariant} show={alertShow} onClose={() => setAlertShow(false)} dismissible>
        {alertMessage}
      </Alert>

      <Row>
        <Col xl={6}>
          <h3>Account Information</h3>
          <Form id="formUpdate" onSubmit={handleProfileUpdateSubmit}>
            <Form.Group controlId="formProfileUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                className="mb-2"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength="3"
              />
            </Form.Group>

            <Form.Group controlId="formProfilePassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                className="mb-2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formProfileEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                className="mb-2"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formProfileBirthday">
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                className="mb-2"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-between">

              <Button className="mt-2" variant="primary" type="submit">Update Profile</Button>
              <Button form="formDeregister" className="mt-2" variant="danger" type="submit">Delete Profile</Button>

            </div>

          </Form>

          <Form id="formDeregister" onSubmit={handleDeregisterSubmit}>
          </Form>
        </Col>
      </Row>

      <Modal show={updateModalShow} onHide={handleUpdateModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Account Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to update your Account information?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleUpdateModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirmUpdate} >
            Update Profile
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={deleteModalShow} onHide={handleDeleteModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your Profile?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete} >
            Delete Profile
          </Button>
        </Modal.Footer>
      </Modal>

      <hr />

      <h3>Favorite Movies</h3>
      {
        favoriteMovies.length === 0 ? (
          <div></div>
        ) : (
          <Row>
            {favoriteMovies.map((movie) => (
              <Col className="mb-5" key={movie._id} xxl={2} xl={3} lg={4} md={4} sm={6} xs={12}>
                <MovieCard movie={movie} />
              </Col>
            ))}
          </Row>
        )
      }
    </>
  );
};
