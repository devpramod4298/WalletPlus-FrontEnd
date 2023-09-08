import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import TranferAmountPage from "../transfer";
import { BrowserRouter } from "react-router-dom";

// Mock the entire axios module
jest.mock("axios");
const mockStore = configureStore([]);
describe("TranferAmountPage", () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      auth: {
        token: "sample token",
      },
    });
  });
  test('disables the "Transfer" button Page Loaded', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <TranferAmountPage />
        </BrowserRouter>
      </Provider>
    );

    const transferButton = screen.getByText("Transfer");

    // The button should be disabled initially
    expect(transferButton).toBeDisabled();
  });

  test('disables the "Transfer" button when username is empty', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <TranferAmountPage />
        </BrowserRouter>
      </Provider>
    );

    const usernameInput = screen.getByPlaceholderText("Enter UserName");
    const transferButton = screen.getByText("Transfer");

    // Simulate valid input
    fireEvent.change(usernameInput, { target: { value: "" } });
    // The button should be disabled initially
    expect(transferButton).toBeDisabled();
  });
  test('disables the "Transfer" button when amount is empty', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <TranferAmountPage />
        </BrowserRouter>
      </Provider>
    );
    const amountInput = screen.getByLabelText("Amount(in Rupees)");
    const transferButton = screen.getByText("Transfer");

    // Simulate valid input
    fireEvent.change(amountInput, { target: { value: "50" } });
    fireEvent.change(amountInput, { target: { value: "" } });
    expect(transferButton).toBeDisabled();
  });

  test('enables the "Transfer" button when username and amount are valid', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <TranferAmountPage />
        </BrowserRouter>
      </Provider>
    );
    const usernameInput = screen.getByPlaceholderText("Enter UserName");
    const amountInput = screen.getByLabelText("Amount(in Rupees)");
    const transferButton = screen.getByText("Transfer");

    // Simulate valid input
    fireEvent.change(usernameInput, { target: { value: "user123" } });
    fireEvent.change(amountInput, { target: { value: "50" } });

    // The button should be enabled
    expect(transferButton).not.toBeDisabled();
  });

  test("displays success snackbar after successful transfer", async () => {
    axios.post.mockResolvedValue({ data: {} });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <TranferAmountPage />
        </BrowserRouter>
      </Provider>
    );

    const usernameInput = screen.getByPlaceholderText("Enter UserName");
    const amountInput = screen.getByLabelText("Amount(in Rupees)");
    const transferButton = screen.getByText("Transfer");

    // Simulate valid input and click the "Transfer" button
    fireEvent.change(usernameInput, { target: { value: "user123" } });
    fireEvent.change(amountInput, { target: { value: "50" } });
    fireEvent.click(transferButton);

    // Wait for the success snackbar to appear
    await waitFor(() => {
      const successSnackbar = screen.getByText("Transfer Done!");
      expect(successSnackbar).toBeInTheDocument();
    });
  });

  test("displays error snackbar after failed transfer due to server side error", async () => {
    const errorMessage = "Transfer failed";
    axios.post.mockRejectedValueOnce({ response: { data: errorMessage } });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <TranferAmountPage />
        </BrowserRouter>
      </Provider>
    );

    const usernameInput = screen.getByPlaceholderText("Enter UserName");
    const amountInput = screen.getByLabelText("Amount(in Rupees)");
    const transferButton = screen.getByText("Transfer");

    // Simulate valid input and click the "Transfer" button
    fireEvent.change(usernameInput, { target: { value: "user123" } });
    fireEvent.change(amountInput, { target: { value: "50" } });
    fireEvent.click(transferButton);

    // Wait for the error snackbar to appear
    await waitFor(() => {
      const errorSnackbar = screen.getByText(errorMessage + "!");
      expect(errorSnackbar).toBeInTheDocument();
    });
  });
  test("displays error snackbar after failed transfer due to clent side error", async () => {
    const errorMessage = "Something went wrong";
    axios.post.mockRejectedValueOnce({ message: errorMessage });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <TranferAmountPage />
        </BrowserRouter>
      </Provider>
    );

    const usernameInput = screen.getByPlaceholderText("Enter UserName");
    const amountInput = screen.getByLabelText("Amount(in Rupees)");
    const transferButton = screen.getByText("Transfer");

    // Simulate valid input and click the "Transfer" button
    fireEvent.change(usernameInput, { target: { value: "user123" } });
    fireEvent.change(amountInput, { target: { value: "50" } });
    fireEvent.click(transferButton);

    // Wait for the error snackbar to appear
    await waitFor(() => {
      const errorSnackbar = screen.getByText(errorMessage + "!");
      expect(errorSnackbar).toBeInTheDocument();
    });
  });

  test("close the snackbar when close button is clicked on alert snackbar", async () => {
    const errorMessage = "Something went wrong";
    axios.post.mockRejectedValueOnce({ message: errorMessage });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <TranferAmountPage />
        </BrowserRouter>
      </Provider>
    );
    const usernameInput = screen.getByPlaceholderText("Enter UserName");
    const amountInput = screen.getByLabelText("Amount(in Rupees)");
    const transferButton = screen.getByText("Transfer");

    // Simulate valid input and click the "Transfer" button
    fireEvent.change(usernameInput, { target: { value: "user123" } });
    fireEvent.change(amountInput, { target: { value: "50" } });
    fireEvent.click(transferButton);

    // Wait for the error snackbar to appear
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
