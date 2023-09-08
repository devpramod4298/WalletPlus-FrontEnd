import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../Login";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
const mockStore = configureStore([]);

// Mocking axios for various responses
jest.mock("axios");

describe("LoginPage component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      myState: "sample text",
    });
  });
  it("submits the form and displays success snackbar on successful login", async () => {
    axios.post.mockResolvedValue({
      data: {
        token: "mockedToken",
        username: "testUser",
        email: "test@example.com",
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signInButton = screen.getByText("Sign In");

    // Fill in the form inputs
    fireEvent.change(usernameInput, { target: { value: "testUser" } });
    fireEvent.change(passwordInput, { target: { value: "testPassword" } });

    // Click the "Sign In" button
    fireEvent.click(signInButton);

    // Wait for the success snackbar to appear
    await waitFor(() => {
      const successSnackbar = screen.getByText("Login successful!");
      expect(successSnackbar).toBeInTheDocument();
    });
  });

  it("displays error snackbar on failed login with invalid credentials", async () => {
    axios.post.mockRejectedValue({
      response: {
        data: {
          message: "Invalid credentials",
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signInButton = screen.getByText("Sign In");

    // Fill in the form inputs
    fireEvent.change(usernameInput, { target: { value: "testUser" } });
    fireEvent.change(passwordInput, { target: { value: "testPassword" } });

    // Click the "Sign In" button
    fireEvent.click(signInButton);

    // Wait for the success snackbar to appear
    await waitFor(() => {
      const successSnackbar = screen.getByText("Invalid credentials!");
      expect(successSnackbar).toBeInTheDocument();
    });
  });
  it("displays error snackbar on network error during login", async () => {
    axios.post.mockRejectedValue({
      message: "Somthing went wrong",
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signInButton = screen.getByText("Sign In");

    // Fill in the form inputs
    fireEvent.change(usernameInput, { target: { value: "testUser" } });
    fireEvent.change(passwordInput, { target: { value: "testPassword" } });

    // Click the "Sign In" button
    fireEvent.click(signInButton);

    // Wait for the success snackbar to appear
    await waitFor(() => {
      const successSnackbar = screen.getByText("Somthing went wrong!");
      expect(successSnackbar).toBeInTheDocument();
    });
  });

  it("close snackbar when click on close button", async () => {
    axios.post.mockRejectedValue({
      message: "Somthing went wrong",
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signInButton = screen.getByText("Sign In");

    // Fill in the form inputs
    fireEvent.change(usernameInput, { target: { value: "testUser" } });
    fireEvent.change(passwordInput, { target: { value: "testPassword" } });

    // Click the "Sign In" button
    fireEvent.click(signInButton);

    // Wait for the success snackbar to appear
    await waitFor(() => {
      const snackbar = screen.getByRole("alert");
      expect(snackbar).toBeInTheDocument();
    });

    // Find the close button and click it
    const closeButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeButton);

    // Ensure the snackbar is no longer in the document
    await waitFor(() => {
      const snackbar = screen.queryByRole("alert");
      expect(snackbar).toBeNull();
    });
  });
});
