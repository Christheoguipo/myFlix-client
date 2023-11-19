import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";
import { MoviesList } from "../movies-list/movies-list";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector, useDispatch } from "react-redux";
import { setMovies } from "../../redux/reducers/movies";
import { setUsers } from "../../redux/reducers/users";

export const MainView = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  const movies = useSelector((state) => state.movies.list);
  // const users = useSelector((state) => state.users);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch("https://retro-movie-vault-5ccf6999c998.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
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
              Description: data.Genre.Description,
            },
            Director: {
              Name: data.Director.Name,
              Bio: data.Director.Bio,
              Birthyear: data.Director.Birthyear,
              Deathyear: data.Director.Deathyear,
            },
            Actors: data.Actors,
            _id: data._id,
            Title: data.Title,
            Description: data.Description,
            Imageurl: data.Imageurl,
            Featured: data.Featured,
          };
        });

        dispatch(setMovies(moviesFromApi));
      })
      .catch((e) => {
        console.log(e);
        alert("Error occurred while getting all movies.");
      });

    fetch("https://retro-movie-vault-5ccf6999c998.herokuapp.com/users", {
      headers: { Authorization: `Bearer ${token}` },
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
            FavoriteMovies: data.FavoriteMovies,
          };
        });
        dispatch(setUsers(usersFromApi));
      })
      .catch((e) => {
        console.log(e);
        alert("Error occurred while getting all users.");
      });

    if (location) {
      console.log("message", location)
    }
  }, [token]);

  return (
    <BrowserRouter>
      <NavigationBar />

      <Row className="justify-content-center h-75">
        <Routes>
          {/* Profile View */}
          <Route
            path="/users/:usernameParam"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : (
                  <Col>
                    <ProfileView user={user} token={token} movies={movies} />
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
                  <>
                    <SignupView />
                  </>
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
                  <>
                    <LoginView />
                  </>
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
                  <Col></Col>
                ) : (
                  <>
                    <MovieView />
                  </>
                )}
              </>
            }
          />

          <Route
            path="/"
            element={
              <>{!user ? <Navigate to="/login" replace /> : <MoviesList />}</>
            }
          />

          {/* Reroutes the user to the home page for invalid urls */}
          <Route
            path="*"
            element={
              <>{!user ? <Navigate to="/login" replace /> : <Navigate to="/" replace />}</>
            }
          />
        </Routes>
      </Row>
    </BrowserRouter>
  );
};
