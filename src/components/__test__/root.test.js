import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import RootLayout from "../Root";
import { BrowserRouter } from "react-router-dom";

describe("RootLayout component", () => {
  const mockStore = configureStore([]);
  const initialState = {
    auth: {
      token: "mockToken",
      userId: "mockUserId",
      username: "mockUsername",
      email: "mockEmail",
    },
  };
  const store = mockStore(initialState);

  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <RootLayout />
        </Provider>
      </BrowserRouter>
    );
  });
});
