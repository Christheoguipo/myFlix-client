import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import React from 'react';
import "./movie-view.scss";
import Row from 'react-bootstrap/Row'

export const MovieView = ({ movies }) => {
  const { movieId } = useParams();

  const movie = movies.find((m) => m._id === movieId);

  return (
    <Row>
      <div>
        <img className="w-100" src={movie.Imageurl} />
      </div>
      <div>
        <span>Title: </span>
        <span>{movie.Title}</span>
      </div>
      <div>
        <span>Movie Description: </span>{movie.Description}
      </div>
      <div>
        <span>Genre: </span>
        <span>{movie.Genre.Name}</span>
      </div>
      <div>
        <span>Directed by </span>
        <span>{movie.Director.Name}</span>
      </div>
      <Link to={"/"} >
        <button className="back-button">Back</button>
      </Link>
    </Row>
  );
};
