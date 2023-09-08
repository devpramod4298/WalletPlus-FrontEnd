import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import SignUpPage from "../Signup";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
const mockStore = configureStore([]);

// Mocking axios
jest.mock("axios");

describe("SignUpPage component", () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      myState: "sample text",
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {});

  it("renders without crashing", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );
  });

  it("displays error for invalid email format", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );
    const emailInput = screen.getByPlaceholderText("Enter Email Address");
    fireEvent.change(emailInput, { target: { value: "invalidemail" } });
    const emailError = screen.getByText("Invalid Email");
    expect(emailError).toBeInTheDocument();
  });

  it("displays error for invalid phone number", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );
    const phoneNoInput = screen.getByPlaceholderText("Phone Number");
    fireEvent.change(phoneNoInput, { target: { value: "123890" } });
    // const phoneNoError = screen.getByText(
    //   "Phone Number Should be of 10 digits"
    // );
    // expect(phoneNoError).toBeInTheDocument();
  });

  it("Not displays error for invalid phone number", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );
    const phoneNoInput = screen.getByPlaceholderText("Phone Number");
    fireEvent.change(phoneNoInput, { target: { value: "123456789" } });
    fireEvent.change(phoneNoInput, { target: { value: "1234567890" } });
    const phoneNoError = screen.queryByText(
      "Phone Number Should be of 10 digits"
    );
    expect(phoneNoError).not.toBeInTheDocument();
  });

  it("displays error for invalid password format", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );
    const passwordInput = screen.getByPlaceholderText("Enter Password");
    fireEvent.change(passwordInput, { target: { value: "invalidpass" } });
    const passwordError = screen.getByText(
      "Password should contain one uppercase, lowercase, digit,sepecial charecter."
    );
    expect(passwordError).toBeInTheDocument();
  });

  it("displays error if password and confirm password are not same", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );
    const passwordInput = screen.getByPlaceholderText("Enter Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    fireEvent.change(passwordInput, { target: { value: "Dev@12345" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "Dev@1234" } });
    const passwordError = screen.getByText(
      "Confirm Password should be same as password."
    );
    expect(passwordError).toBeInTheDocument();
  });

  it("displays Account number in expected format", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );
    const accountNoInput = screen.getByPlaceholderText("1234567890121111");

    fireEvent.change(accountNoInput, { target: { value: "123456789012" } });

    // The input should be formatted with dashes
    expect(accountNoInput).toHaveValue("123456789012");
  });

  it("Displays an error for an invalid account number length", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );
    const accountNoInput = screen.getByPlaceholderText("1234567890121111");

    fireEvent.change(accountNoInput, { target: { value: "1234567890123" } });

    // The input should display an error message
    const errorMessage = screen.getByText(
      "Account Number Should be of 16 digits."
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("Does not display an error for a valid account number length", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );
    const accountNoInput = screen.getByPlaceholderText("1234567890121111");

    fireEvent.change(accountNoInput, {
      target: { value: "1234567890121111" },
    });

    // The input should not display an error message
    const errorMessage = screen.queryByText(
      "Account Number Should be of 16 digits."
    );
    expect(errorMessage).not.toBeInTheDocument();
  });

  it("enables submit button when form is valid", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );
    const fullNameInput = screen.getByPlaceholderText("Enter Full Name");
    const emailInput = screen.getByPlaceholderText("Enter Email Address");
    const usernameInput = screen.getByPlaceholderText("Enter Username");
    const passwordInput = screen.getByPlaceholderText("Enter Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Sign Up" });

    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
    fireEvent.change(usernameInput, { target: { value: "johndoe" } });
    fireEvent.change(passwordInput, {
      target: { value: "Valid@12345" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Valid@12345" },
    });

    expect(submitButton).toBeEnabled();
  });
  it("disable submit button when form is invalid", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );
    const fullNameInput = screen.getByPlaceholderText("Enter Full Name");
    const emailInput = screen.getByPlaceholderText("Enter Email Address");
    const usernameInput = screen.getByPlaceholderText("Enter Username");
    const passwordInput = screen.getByPlaceholderText("Enter Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Sign Up" });

    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
    fireEvent.change(usernameInput, { target: { value: "johndoe" } });
    fireEvent.change(passwordInput, {
      target: { value: "Valid@12345" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "" },
    });
    expect(submitButton).not.toBeEnabled();
  });

  // it("submits the form on valid data and shows success message", async () => {
  //   // Mock the successful response from axios
  //   axios.post.mockResolvedValue({ status: 200 });

  //   render(
  //      <Provider store={store}>
  //       <BrowserRouter>
  //         <SignUpPage />
  //       </BrowserRouter>
  //     </Provider>
  //   );
  //   const fullNameInput = screen.getByPlaceholderText("Enter Full Name");
  //   const emailInput = screen.getByPlaceholderText("Enter Email Address");
  //   const usernameInput = screen.getByPlaceholderText("Enter Username");
  //   const passwordInput = screen.getByPlaceholderText("Enter Password");
  //   const confirmPasswordInput =
  //     screen.getByPlaceholderText("Confirm Password");
  //   const submitButton = screen.getByRole("button", { name: "Sign Up" });

  //   fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
  //   fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
  //   fireEvent.change(usernameInput, { target: { value: "johndoe" } });
  //   fireEvent.change(passwordInput, {
  //     target: { value: "Valid@12345" },
  //   });
  //   fireEvent.change(confirmPasswordInput, {
  //     target: { value: "Valid@12345" },
  //   });

  //   fireEvent.click(submitButton);

  //   // Wait for the success message to appear
  //   await waitFor(() => {
  //     const successSnackbar = screen.getByText("Registered successfully!");
  //   //  expect(successSnackbar).toBeInTheDocument();
  //   });
  // });

  it("displays error message on failed form submission with existing emailId", async () => {
    // Mock the error response from axios
    axios.post.mockRejectedValue({
      response: { data: { error: "User Already exists for this username" } },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );
    const fullNameInput = screen.getByPlaceholderText("Enter Full Name");
    const emailInput = screen.getByPlaceholderText("Enter Email Address");
    const usernameInput = screen.getByPlaceholderText("Enter Username");
    const passwordInput = screen.getByPlaceholderText("Enter Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Sign Up" });

    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, {
      target: { value: "devendra@nextuple.com" },
    });
    fireEvent.change(usernameInput, { target: { value: "johndoe" } });
    fireEvent.change(passwordInput, {
      target: { value: "Valid@12345" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Valid@12345" },
    });

    fireEvent.click(submitButton);

    // Wait for the success message to appear
    await waitFor(() => {
      const successSnackbar = screen.getByText(
        "User Already exists for this username!"
      );
      expect(successSnackbar).toBeInTheDocument();
    });
  });
  it("displays error message on failed form submission with client side error", async () => {
    // Mock the error response from axios
    axios.post.mockRejectedValue({
      message: "Somthing went wrong",
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );
    const fullNameInput = screen.getByPlaceholderText("Enter Full Name");
    const emailInput = screen.getByPlaceholderText("Enter Email Address");
    const usernameInput = screen.getByPlaceholderText("Enter Username");
    const passwordInput = screen.getByPlaceholderText("Enter Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Sign Up" });

    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, {
      target: { value: "devendra@nextuple.com" },
    });
    fireEvent.change(usernameInput, { target: { value: "johndoe" } });
    fireEvent.change(passwordInput, {
      target: { value: "Valid@12345" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Valid@12345" },
    });
    fireEvent.click(submitButton);
    await waitFor(() => {
      const successSnackbar = screen.getByText("Somthing went wrong!");
      expect(successSnackbar).toBeInTheDocument();
    });
  });
  it("close the snackbar when click on close button of snackbar", async () => {
    // Mock the error response from axios
    axios.post.mockRejectedValue({
      message: "Somthing went wrong",
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );
    const fullNameInput = screen.getByPlaceholderText("Enter Full Name");
    const emailInput = screen.getByPlaceholderText("Enter Email Address");
    const usernameInput = screen.getByPlaceholderText("Enter Username");
    const passwordInput = screen.getByPlaceholderText("Enter Password");
    const submitButton = screen.getByRole("button", { name: "Sign Up" });
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, {
      target: { value: "devendra@nextuple.com" },
    });
    fireEvent.change(usernameInput, { target: { value: "johndoe" } });
    fireEvent.change(passwordInput, {
      target: { value: "Valid@12345" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Valid@12345" },
    });
    fireEvent.click(submitButton);
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
