import React from "react";
import { useSelector } from "react-redux";
import { MovieCard } from "../movie-card/movie-card";
import { MoviesFilter } from "../movies-filter/movies-filter";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export const MoviesList = () => {
  const movies = useSelector((state) => state.movies.list);
  const filter = useSelector((state) => state.movies.filter).trim().toLowerCase();
  const filteredMovies = movies.filter((movie) => movie.Title.toLowerCase().includes(filter));

  return (
    <>
      <Row className="justify-content-center my-4" >
        <Col md={4}>
          <MoviesFilter />
        </Col>
      </Row>
      <Row>
        {movies.length === 0 ? (
          <Col></Col>
          // <Col>The list is empty!</Col>
        ) : (
          filteredMovies.map((movie) => (
            <Col className="mb-4" key={movie._id} md={2}>
              <MovieCard movie={movie} />
            </Col>
          ))
        )}
      </Row>
    </>
  );
};