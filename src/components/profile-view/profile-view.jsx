import React, { useState } from "react";
import { useParams } from "react-router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { MovieCard } from "../movie-card/movie-card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export const ProfileView = ({ users, token, favoriteMovies, onProfileUpdate, onProfileDeregister, onAddToFavorites, onRemoveFromFavorites }) => {

  const { usernameParam } = useParams();
  const user = users.find((user) => user.Username === usernameParam);

  const formattedDate = new Date(user.Birthday).toISOString().substring(0, 10);

  const [username, setUsername] = useState(user.Username);
  const [password, setPassword] = useState(user.Password);
  const [email, setEmail] = useState(user.Email);
  const [birthday, setBirthday] = useState(formattedDate);

  const handleProfileUpdateSubmit = (event) => {
    event.preventDefault();

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
        console.log("User update response: ", data);

        if (data) {

          onProfileUpdate(data);
          localStorage.setItem("user", JSON.stringify(data));

          alert("User successfully updated!");

        } else {
          alert("No such user.");
        }
      })
      .catch((e) => {
        console.log(e);
        alert("Error occurred during user update.");
      });

  };

  const handleDeregisterSubmit = (event) => {
    event.preventDefault();

    if (confirm("This will remove your account permanently. Are you sure you want to deregister?")) {

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
          console.log("User Deregister response: ", data);

          if (data) {

            alert("User successfully deregistered!");

            onProfileDeregister();
          } else {
            alert("No such user.");
          }
        })
        .catch((e) => {
          console.log(e);
          alert("Error occurred during user deregister.");
        });
    }
  }

  return (
    <>
      <h3>User Detail</h3>
      <Form onSubmit={handleProfileUpdateSubmit}>
        <Form.Group controlId="formProfileUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formProfileEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formProfileBirthday">
          <Form.Label>Birthday</Form.Label>
          <Form.Control
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />
        </Form.Group>
        <div className="d-flex justify-content-between">

          <Button className="mt-2" variant="primary" type="submit">Update Profile</Button>
          <Button form="formDeregister" className="mt-2" variant="danger" type="submit">Deregister</Button>
        </div>

      </Form>

      <Form id="formDeregister" onSubmit={handleDeregisterSubmit}>
      </Form>
      <hr />
      <h3>Favorite Movies</h3>
      {favoriteMovies.length === 0 ? (
        <div>
          Your list of favorite movies is empty!
        </div>
      ) : (
        <Row>
          {favoriteMovies.map((movie) => (
            <Col className="mb-5" key={movie._id} md={4}>
              <MovieCard movie={movie} user={user} token={token}
                onAddToFavorites={onAddToFavorites}
                onRemoveFromFavorites={onRemoveFromFavorites} />
            </Col>
          ))}
        </Row>
      )}

    </>
  );

};
