import React from 'react';

export const MovieView = ({ movie, onBackClick }) => {
  return (
    <div>
      <div>
        <span>Title: </span>
        <span>{movie.Title}</span>
      </div>
      <div>
        <img src={movie.Imageurl} alt={movie.Title} />
      </div>
      <div>
        <span>Movie Description: </span>{movie.Description}
      </div>
      <div>
        <span>Genre: </span>
        <span>{movie.Genre.Name}</span>
        {/* <div>Genre Description: <span>{ movie.Genre.Description }</span></div> */}
      </div>
      <div>
        <span>Directed by </span>
        <span>{movie.Director.Name}</span>
        {/* <div><span>Director's Bio: </span>{movie.Director.Bio}</div>
        <div><span>Birthday: </span>{movie.Director.Birthyear}</div> */}
      </div>
      <button onClick={onBackClick}>Back</button>
    </div>
  )
};
