import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./reducers/movies";
import userReducer from "./reducers/user";
import usersReducer from "./reducers/users";

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    user: userReducer,
    users: usersReducer,
  }
});