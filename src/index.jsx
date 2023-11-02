import { createRoot } from 'react-dom/client';
import { MainView } from './components/main-view/main-view';
import React from 'react';
import Container from 'react-bootstrap/Container';
import { store } from "./redux/store";
import { Provider } from "react-redux";

// Import statement to indicate that you need to bundle `./index.scss`
import "./index.scss";

// Main component (will eventually use all the others)
const MyFlixApplication = () => {
  return (
    <Provider store={store}>
      <Container className="h-100" fluid style={{ border: "1px " }}>
        <MainView />
      </Container>
    </Provider>
  );
};

// Finds the root of your app
const container = document.querySelector("#root");
const root = createRoot(container);

// Tells React to render your app in the root DOM element
root.render(<MyFlixApplication />);