import PropTypes from "prop-types";
import React from 'react';
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export const MovieCard = ({ movie, user, token, onAddToFavorites, onRemoveFromFavorites }) => {

  const isFavorite = user ? user.FavoriteMovies.includes(movie._id) : false;

  const handleFavoriteClick = (event) => {
    if (isFavorite) {
      // Remove from Favorite
      fetch(`https://retro-movie-vault-5ccf6999c998.herokuapp.com/users/${user.Username}/movies/${movie._id}`, {
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
          console.log("Movie removed from favorites response: ", data);

          if (data) {

            onRemoveFromFavorites(movie._id);
          } else {
            alert("No such movie.");
          }
        })
        .catch((e) => {
          console.log(e);
          alert("Error occurred while removing favorite movie.");
        });
    } else {
      // Add to favorite
      fetch(`https://retro-movie-vault-5ccf6999c998.herokuapp.com/users/${user.Username}/movies/${movie._id}`, {
        method: "POST",
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
          console.log("Movie added to favorites response: ", data);

          if (data) {

            onAddToFavorites(movie._id);
          } else {
            alert("No such movie.");
          }
        })
        .catch((e) => {
          console.log(e);
          alert("Error occurred while adding favorite movie.");
        });
    }
  }

  return (
    <Card className="h-100">
      <Card.Img variant="top" src={movie.Imageurl} />
      <Card.Body>
        <Card.Title>
          {movie.Title}
        </Card.Title>
        <Card.Text>{movie.Director.Name}</Card.Text>
        <div className="d-flex justify-content-between">
          <Link to={`/movies/${encodeURIComponent(movie._id)}`} >
            <Button variant="link">Open</Button>
          </Link>
          <Button variant="link" onClick={handleFavoriteClick}>
            {isFavorite ? "Unfavorite" : "Favorite"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired
    }),
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired
    }),
    Imageurl: PropTypes.string.isRequired
  })
}
