import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../NavBar";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import mediaQuery from "css-mediaquery";

const createMatchMedia = (width) => (query) => ({
  matches: mediaQuery.match(query, { width }),
  addListener: () => {},
  removeListener: () => {},
});

const mockStore = configureStore([]);

describe("Header", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        token: "sample token",
      },
    });
  });
  it("opens and closes navigation menu", () => {
    window.matchMedia = createMatchMedia(200);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );
    const menuButton = screen.getByLabelText("account of current user");

    // Menu should be initially closed

    // Open the navigation menu
    fireEvent.click(menuButton);

    // Menu should be open
    const transactionsItems = screen.getAllByText("My Transactions");
    expect(transactionsItems.length).toBeGreaterThan(0);

    // Close the navigation menu
    fireEvent.click(menuButton);

    // Menu should be closed again
    expect(transactionsItems.length).toBeGreaterThan(0);
  });

  it("opens and closes user menu", () => {
    window.matchMedia = createMatchMedia(200);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );
    const userMenuButton = screen.getByRole("button", {
      name: "profile",
    });
    expect(screen.getByText("Logout")).toBeInTheDocument();
    fireEvent.click(userMenuButton);
    expect(screen.getByText("Logout")).toBeInTheDocument();
    fireEvent.click(userMenuButton);
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });
});
