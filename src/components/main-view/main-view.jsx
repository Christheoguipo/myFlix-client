import React, { useEffect, useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);



  useEffect(() => {
    if (!token) {
      return;
    }

    fetch("https://retro-movie-vault-5ccf6999c998.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
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
      });
  }, [token]);

  return (
    <Row className="justify-content-md-center">
      {!user ? (
        <Col md={5}>
          <LoginView onLoggedIn={(user, token) => {
            setUser(user);
            setToken(token);
          }} />
          or
          <SignupView />
        </Col>
      ) : selectedMovie ? (
        <Col md={8} style={{ border: "1px solid black" }}>
          <MovieView
            style={{ border: "1px solid green" }}
            movie={selectedMovie}
            onBackClick={() => setSelectedMovie(null)}
          />
        </Col>
      ) : movies.length === 0 ? (
        <>
          <div>
            <span>The list is empty!</span>

            <button className="float-end btn btn-danger"
              onClick={() => {
                setUser(null);
                setToken(null);
                localStorage.clear();
              }}>Logout</button>
          </div>

        </>
      ) : (
        <>

          <div>
            <button className="float-end btn btn-danger"
              onClick={() => {
                setUser(null);
                setToken(null);
                localStorage.clear();
              }}>Logout</button>
          </div>

          {movies.map((movie) => (
            <Col key={movie._id} className="mb-5" md={3}>
              <MovieCard
                movie={movie}
                onMovieClick={(newSelectedMovie) => {
                  setSelectedMovie(newSelectedMovie);
                }}
              />
            </Col>
          ))}

        </>
      )}
    </Row>
  );

};
