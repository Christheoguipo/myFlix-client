import { useState } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export const MainView = () => {
  const [movies, setMovies] = useState([
  {
    "Genre": {
        "Name": "Drama",
        "Description": "Dramas follow a clearly defined narrative plot structure, portraying real-life scenarios or extreme situations with emotionally-driven characters."
    },
    "Director": {
        "Name": "Steven Spielberg",
        "Bio": "Steven Spielberg is a prolific filmmaker known for directing classic movies like \"E.T. the Extra-Terrestrial\" and \"Jurassic Park.\"",
        "Birthyear": "1946-12-18",
        "Deathyear": null
    },
    "Actors": [],
    "_id": "651218a699eb8a7d7fdf59c8",
    "Title": "Saving Private Ryan",
    "Description": "Set in 1944 in France during World War II, it follows a group of soldiers, led by Captain John Miller (Tom Hanks), on their mission to locate Private James Francis Ryan (Matt Damon) and bring him home safely after his three brothers are killed in action.",
    "Imageurl": "https://upload.wikimedia.org/wikipedia/en/thumb/a/ac/Saving_Private_Ryan_poster.jpg/220px-Saving_Private_Ryan_poster.jpg",
    "Featured": false,
    "Bio": "This bio has been changed."
  },
  {
    "Genre": {
        "Name": "Animated",
        "Description": "Animation is a method in which pictures are manipulated to appear as moving images. In traditional animation, images are drawn or painted by hand on transparent celluloid sheets to be photographed and exhibited on film."
    },
    "Director": {
        "Name": "Jonathan Demme",
        "Bio": "Robert Jonathan Demme was an American director, producer, and screenwriter.",
        "Birthyear": "1944-01-01",
        "Deathyear": "2017-01-01"
    },
    "Actors": [],
    "_id": "6512158099eb8a7d7fdf59c7",
    "Title": "Silence of the Lambs",
    "Description": "A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.",
    "Imageurl": "https://s3.amazonaws.com/static.rogerebert.com/uploads/blog_post/primary_image/features/timeless-horror-the-25th-anniversary-of-the-silence-of-the-lambs/silence-of-the-lambs.jpg",
    "Featured": true
  },
  {
      "Genre": {
          "Name": "Adventure",
          "Description": "A common theme of adventure films is of characters leaving their home or place of comfort and going to fulfill a goal, embarking on travels, quests, treasure hunts, heroic journeys; and explorations or searches for the unknown."
      },
      "Director": {
          "Name": "Steven Spielberg",
          "Bio": "Steven Spielberg is a prolific filmmaker known for directing classic movies like \"E.T. the Extra-Terrestrial\" and \"Jurassic Park.\"",
          "Birthyear": "1946-12-18",
          "Deathyear": null
      },
      "Actors": [],
      "_id": "651218a699eb8a7d7fdf59ca",
      "Title": "Jurassic Park",
      "Description": "Jurassic Park is a 1993 American science fiction-adventure-drama film directed by Steven Spielberg, based upon the novel of the same name, written by Michael Crichton. The story involves scientists visiting a safari amusement park of genetically engineered dinosaurs on an island over one weekend.",
      "Imageurl": "https://i.etsystatic.com/22248595/r/il/1859f6/2180897048/il_fullxfull.2180897048_opdq.jpg",
      "Featured": false,
      "Bio": "This bio has been changed."
  }
  ]);

  const [selectedMovie, setSelectedMovie] = useState(null);

  if (selectedMovie) {
    return (
      <MovieView
        movie={selectedMovie}
        onBackClick={() => {
          setSelectedMovie(null);
        }}
      />
    );
  }

  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  return (
    <div>
      { movies.map((movie) => {
        return (
          <MovieCard
            key={movie._id}
            movie={movie}
            onMovieClick={(newSelectedMovie) => {
              setSelectedMovie(newSelectedMovie);
            }}
          />
        );
      })}
    </div>
  );
};
