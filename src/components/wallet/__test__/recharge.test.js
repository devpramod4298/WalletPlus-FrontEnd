import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WalletRechagePage from "../recharge";
import axios from "axios";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
// Mock the entire axios module
jest.mock("axios");
const mockStore = configureStore([]);
describe("WalletRechagePage", () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      auth: {
        token: "sample token",
      },
    });
  });
  test('It enables the "Recharge" button when amount is valid', () => {
    // const root = document.createElement("root");
    // createRoot(root).render(<WalletRechagePage />);
    render(
      <BrowserRouter>
        <Provider store={store}>
          <WalletRechagePage />
        </Provider>
      </BrowserRouter>
    );
    const amountInput = screen.getByLabelText("Amount(in Rupees)");
    const rechargeButton = screen.getByText("Recharge");

    // Simulate valid input
    fireEvent.change(amountInput, { target: { value: "50" } });

    // The button should be enabled
    expect(rechargeButton).not.toBeDisabled();
  });
  test('It disable the "Recharge" button when amount is invalid', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <WalletRechagePage />
        </Provider>
      </BrowserRouter>
    );
    const amountInput = screen.getByLabelText("Amount(in Rupees)");
    const rechargeButton = screen.getByText("Recharge");

    // Simulate valid input
    fireEvent.change(amountInput, { target: { value: "" } });
    expect(rechargeButton).toBeDisabled();
  });
  test('It disable the "Recharge" button when amount is NaN', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <WalletRechagePage />
        </Provider>
      </BrowserRouter>
    );

    const amountInput = screen.getByLabelText("Amount(in Rupees)");
    const rechargeButton = screen.getByText("Recharge");

    // Simulate valid input
    fireEvent.change(amountInput, { target: { value: "NaN" } });
    expect(rechargeButton).toBeDisabled();
  });
  test('It enables the "Recharge" button when amount is valid and submits successfully', async () => {
    // Mock the axios.post function to resolve with a successful response
    axios.post.mockResolvedValue({
      data: "Recharged Successfully",
      status: 200,
      statusText: "",
      headers: "AxiosHeaders",
    });

    render(
      <BrowserRouter>
        <Provider store={store}>
          <WalletRechagePage />
        </Provider>
      </BrowserRouter>
    );

    const amountInput = screen.getByLabelText("Amount(in Rupees)");
    const rechargeButton = screen.getByText("Recharge");

    // Simulate valid input
    fireEvent.change(amountInput, { target: { value: "50" } });

    // The button should be enabled
    expect(rechargeButton).not.toBeDisabled();

    // Click the "Recharge" button
    fireEvent.click(rechargeButton);

    // Wait for the success snackbar to appear
    await waitFor(() => {
      const successSnackbar = screen.getByText("Recharge successful!");
      expect(successSnackbar).toBeInTheDocument();
    });
  });
  test("It displays error snackbar after failed recharge", async () => {
    const errorMessage = "Recharge failed";
    axios.post.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    render(
      <BrowserRouter>
        <Provider store={store}>
          <WalletRechagePage />
        </Provider>
      </BrowserRouter>
    );

    const amountInput = screen.getByLabelText("Amount(in Rupees)");
    const rechargeButton = screen.getByText("Recharge");

    // Simulate valid input and click the "Recharge" button
    fireEvent.change(amountInput, { target: { value: "50" } });
    fireEvent.click(rechargeButton);

    // Wait for the error snackbar to appear
    await waitFor(() => {
      const errorSnackbar = screen.getByText(errorMessage + "!");
      expect(errorSnackbar).toBeInTheDocument();
    });
  });
  test("It displays error snackbar after transaction failed due to network", async () => {
    const errorMessage = "something went wrong";
    axios.post.mockRejectedValueOnce({ message: errorMessage });
    render(
      <BrowserRouter>
        <Provider store={store}>
          <WalletRechagePage />
        </Provider>
      </BrowserRouter>
    );
    const amountInput = screen.getByLabelText("Amount(in Rupees)");
    const rechargeButton = screen.getByText("Recharge");

    // Simulate valid input and click the "Recharge" button
    fireEvent.change(amountInput, { target: { value: "50" } });
    fireEvent.click(rechargeButton);

    // Wait for the error snackbar to appear
    await waitFor(() => {
      const errorSnackbar = screen.getByText(errorMessage + "!");
      expect(errorSnackbar).toBeInTheDocument();
    });
  });
  test("It close the snackbar when user close button is clicked on alert", async () => {
    const errorMessage = "something went wrong";
    axios.post.mockRejectedValueOnce({ message: errorMessage });
    render(
      <BrowserRouter>
        <Provider store={store}>
          <WalletRechagePage />
        </Provider>
      </BrowserRouter>
    );

    const amountInput = screen.getByLabelText("Amount(in Rupees)");
    const rechargeButton = screen.getByText("Recharge");

    // Simulate valid input and click the "Recharge" button
    fireEvent.change(amountInput, { target: { value: "50" } });
    fireEvent.click(rechargeButton);

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
