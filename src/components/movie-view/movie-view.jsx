import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import "./movie-view.scss";
import { MovieCard } from '../movie-card/movie-card';

export const MovieView = () => {
  const { movieId } = useParams();
  const movies = useSelector((state) => state.movies.list);
  const movie = movies.find((m) => m._id === movieId);

  const similarMovies = movies.filter((filteredMovie) => filteredMovie.Genre.Name.includes(movie.Genre.Name) && filteredMovie._id !== movie._id);

  return (
    <Col md={9}>
      <Row>
        <Col md={6}>
          <h1>{movie.Title}</h1>

          <div className="d-flex justify-content-between">
            <h3 className="lighter-color">{movie.Director.Name}</h3>
            <div className="d-flex">
              <h5 className="mt-auto">{movie.Genre.Name}</h5>
            </div>
          </div>

          <p>{movie.Description}</p>

          <Link to={"/"} >
            <Button variant="outline-primary">Back</Button>
          </Link>

        </Col>
        <Col md={6}>
          <div className="image-wrapper">
            <img className="image" src={movie.Imageurl} />
          </div>
        </Col>
      </Row>

      <h3>Similar Movies</h3>
      {similarMovies.length === 0 ? (
        <div>
          No similar movies found.
        </div>
      ) : (
        <Row>
          {similarMovies.map((movie) => (
            <Col className="mb-5" key={movie._id} md={3}>
              <MovieCard movie={movie} />
            </Col>
          ))}
        </Row>
      )}
    </Col>
  );
};
