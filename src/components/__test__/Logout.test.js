import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import LogOut from "../Logout";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
const mockStore = configureStore([]);
let assignMock = jest.fn();

delete window.location;
window.location = { assign: assignMock };

describe("LogOut component", () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      myState: "sample text",
    });
  });
  it("displays the modal with proper content", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LogOut />
        </MemoryRouter>
      </Provider>
    );

    // Modal content
    const modalTitle = screen.getByText("Are you sure, you want to log out?");
    const confirmButton = screen.getByText("Yes");
    const cancelButton = screen.getByText("No");

    expect(modalTitle).toBeInTheDocument();
    expect(confirmButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it("closes the modal and goes back when 'No' button is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LogOut />
        </MemoryRouter>
      </Provider>
    );

    // Find the 'No' button and click it
    const cancelButton = screen.getByText("No");
    fireEvent.click(cancelButton);

    // Check if the modal is closed
    const modalTitle = screen.queryByText("Are you sure, you want to log out?");
    expect(modalTitle).toBeNull();

    // Check if window.history.back() was called
    //  expect(window.history.back).toHaveBeenCalled();
  });

  it("closes the modal and logout when 'Yes' button is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LogOut />
        </MemoryRouter>
      </Provider>
    );

    // Find the 'No' button and click it
    const cancelButton = screen.getByText("Yes");
    fireEvent.click(cancelButton);

    // Check if the modal is closed
    const modalTitle = screen.queryByText("Are you sure, you want to log out?");
    expect(modalTitle).toBeNull();

    // Check if window.history.back() was called
    //  expect(window.history.back).toHaveBeenCalled();
  });
});
