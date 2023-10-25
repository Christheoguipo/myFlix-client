import React, { useEffect, useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);

  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);

  const [favoriteMovies, setFavoriteMovies] = useState(user ? movies.filter((m) => user.FavoriteMovies.includes(m._id)) : []);

  // let favoriteMovies = movies.filter(m => user ? user.FavoriteMovies.includes(m._id) : []);

  const handleOnAddToFavorites = (movieId) => {
    const updatedUser = user;

    const updatedUsers = users;
    const userIndex = updatedUsers.findIndex((u) => u._id === user._id);

    updatedUser.FavoriteMovies.push(movieId);
    updatedUsers[userIndex] = updatedUser;

    setUser(updatedUser);
    setUsers(updatedUsers);

    if (user) {
      setFavoriteMovies(movies.filter((m) => user.FavoriteMovies.includes(m._id)));
    }
  }

  const handleOnRemoveFromFavorites = (movieId) => {
    const updatedUser = user;

    const updatedUsers = users;
    const userIndex = updatedUsers.findIndex((u) => u._id === user._id);

    updatedUser.FavoriteMovies = updatedUser.FavoriteMovies.filter(favMovieId => movieId != favMovieId);
    updatedUsers[userIndex] = updatedUser;

    setUser(updatedUser);
    setUsers(updatedUsers);

    if (user) {
      setFavoriteMovies(movies.filter((m) => user.FavoriteMovies.includes(m._id)));
    }

  }

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch("https://retro-movie-vault-5ccf6999c998.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {

        if (!response.ok) {
          console.log(response);
          throw new Error(`HTTP Error: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        const moviesFromApi = data.map((data) => {
          return {
            Genre: {
              Name: data.Genre.Name,
              Description: data.Genre.Description
            },
            Director: {
              Name: data.Director.Name,
              Bio: data.Director.Bio,
              Birthyear: data.Director.Birthyear,
              Deathyear: data.Director.Deathyear
            },
            Actors: data.Actors,
            _id: data._id,
            Title: data.Title,
            Description: data.Description,
            Imageurl: data.Imageurl,
            Featured: data.Featured
          };
        });

        setMovies(moviesFromApi);
        setFavoriteMovies(movies.filter(m => user ? user.FavoriteMovies.includes(m._id) : []));

      })
      .catch((e) => {
        console.log(e);
        alert("Error occurred while getting all movies.");
      });

    fetch("https://retro-movie-vault-5ccf6999c998.herokuapp.com/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        const usersFromApi = data.map((data) => {
          return {
            _id: data._id,
            Username: data.Username,
            Password: data.Password,
            Email: data.Email,
            Birthday: data.Birthday,
            FavoriteMovies: data.FavoriteMovies
          };
        });
        setUsers(usersFromApi);
      })
      .catch((e) => {
        console.log(e);
        alert("Error occurred while getting all users.");
      });

  }, [token]);

  return (
    <BrowserRouter>
      <NavigationBar
        user={user}
        onLoggedOut={() => {
          setUser(null);
          setToken(null);
          localStorage.clear();
        }}
      />

      <Row className="justify-content-md-center">

        <Routes>

          <Route
            path="/users/:usernameParam"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : users.length === 0 ? (
                  <Col>No users found!</Col>
                ) : (
                  <Col md={8}>
                    <ProfileView users={users} token={token}

                      favoriteMovies={favoriteMovies}

                      onProfileUpdate={(user) => {
                        setUser(user);
                      }}

                      onProfileDeregister={() => {
                        setUser(null);
                        setToken(null);
                        localStorage.clear();
                      }}

                      onAddToFavorites={(movieId) => {
                        handleOnAddToFavorites(movieId);
                      }}

                      onRemoveFromFavorites={(movieId) => {
                        handleOnRemoveFromFavorites(movieId);
                      }}
                    />
                  </Col>
                )}
              </>
            }
          />

          <Route
            path="/signup"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <SignupView />
                  </Col>
                )}
              </>
            }
          />

          <Route
            path="/login"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <LoginView onLoggedIn={(user, token) => {
                      setUser(user);
                      setToken(token);
                    }} />
                  </Col>
                )}
              </>
            }
          />

          <Route
            path="/movies/:movieId"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <Col>The list it empty!</Col>
                ) : (
                  <Col md={8}>
                    <MovieView movies={movies} />
                  </Col>
                )}
              </>
            }
          />

          <Route
            path="/"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <Col>The list it empty!</Col>
                ) : (
                  <>
                    {movies.map((movie) => (
                      <Col className="mb-5" key={movie._id} md={3}>
                        <MovieCard movie={movie} user={user} token={token}

                          onAddToFavorites={(movieId) => {
                            handleOnAddToFavorites(movieId);
                          }}

                          onRemoveFromFavorites={(movieId) => {
                            handleOnRemoveFromFavorites(movieId);
                          }}
                        />
                      </Col>
                    ))}
                  </>
                )}
              </>
            }
          />

        </Routes>
      </Row>
    </BrowserRouter>
  );
};
