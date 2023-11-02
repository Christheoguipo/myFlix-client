import PropTypes from "prop-types";
import React from 'react';
import "./movie-card.scss";
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/reducers/user";
import { setUsers } from "../../redux/reducers/users";


export const MovieCard = ({ movie }) => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const users = useSelector((state) => state.users);

  const isFavorite = user ? user.FavoriteMovies.includes(movie._id) : false;

  const AddRemoveToFavorites = (movieId, isAdd) => {
    // Use spread operator to get a shallow copy of the user
    const updatedUser = { ...user };

    if (isAdd) {
      updatedUser.FavoriteMovies = [...updatedUser.FavoriteMovies, movieId];
    } else {
      updatedUser.FavoriteMovies = updatedUser.FavoriteMovies.filter((favMovieId) => favMovieId !== movieId);
    }

    const updatedUsers = [...users];
    const userIndex = updatedUsers.findIndex((u) => u._id === user._id);
    updatedUsers[userIndex] = updatedUser;

    localStorage.setItem("user", JSON.stringify(updatedUser));
    dispatch(setUser(updatedUser));
    dispatch(setUsers(updatedUsers));

  }

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

            AddRemoveToFavorites(movie._id, false);
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

            AddRemoveToFavorites(movie._id, true);
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
    <Card className="h-100 movie-card">
      <div className="card-img-wrapper">
        <Card.Img className="h-100" variant="top" src={movie.Imageurl} />
        <Button className="favorite-button" onClick={handleFavoriteClick}>
          {isFavorite ? <FaHeart className="FaHeart" /> : <FaRegHeart className="FaRegHeart" />}
        </Button>
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title>{movie.Title}</Card.Title>
        <Card.Text>{movie.Genre.Name}</Card.Text>
        <div className="mt-auto text-center">
          <Link to={`/movies/${encodeURIComponent(movie._id)}`}>
            <Button variant="outline-primary">View Details</Button>
          </Link>
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
