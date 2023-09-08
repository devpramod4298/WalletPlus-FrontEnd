import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import AllTransactionPage from "../allTranactionList";
import mediaQuery from "css-mediaquery";

const createMatchMedia = (width) => (query) => ({
  matches: mediaQuery.match(query, { width }),
  addListener: () => {},
  removeListener: () => {},
});

jest.mock("axios");

describe("AllTransactionPage", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        transactions: [
          {
            transactionId: "1692696636966",
            amount: "101",
            transactionType: "Credit",
            sender: "User A",
            receiver: "User B",
            transactionDate: "2023-08-23",
          },
          {
            transactionId: "1692696636965",
            transactionType: "transfer",
            sender: "devendra12",
            receiver: "self",
            amount: 1.0,
            transactionDate: "2023-08-22T09:30:36.966+00:00",
          },
          {
            transactionId: "1692696541546",
            transactionType: "transfer",
            sender: "devendra12",
            receiver: "self",
            amount: 100.0,
            transactionDate: "2023-08-22T09:29:01.547+00:00",
          },
          {
            transactionId: "1692682523755",
            transactionType: "transfer",
            sender: "self",
            receiver: "devendra12",
            amount: -50.0,
            transactionDate: "2023-08-22T05:35:23.756+00:00",
          },
          {
            transactionId: "1692680559126",
            transactionType: "transfer",
            sender: "devendra12",
            receiver: "self",
            amount: 100.0,
            transactionDate: "2023-08-22T05:02:39.127+00:00",
          },
        ],
        currentPage: 0,
        totalItems: 11,
        totalPages: 2,
      },
    });
  });

  it("renders the component", async () => {
    render(<AllTransactionPage />);

    expect(await screen.findByText("All Transactions")).toBeInTheDocument();
    expect(screen.getByText("Transaction Id")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Transaction Type")).toBeInTheDocument();
    expect(screen.getByText("From")).toBeInTheDocument();
    expect(screen.getByText("To")).toBeInTheDocument();
    expect(screen.getByText("Transaction Date")).toBeInTheDocument();
    expect(await screen.findByText("1692696636966")).toBeInTheDocument();
    expect(await screen.findByText("101")).toBeInTheDocument();
    expect(await screen.findByText("Credit")).toBeInTheDocument();
    expect(await screen.findByText("User A")).toBeInTheDocument();
    expect(await screen.findByText("User B")).toBeInTheDocument();
    expect(await screen.findByText("Aug 23, 2023")).toBeInTheDocument();
  });

  it("updates transactions on page change", async () => {
    render(<AllTransactionPage />);

    expect(await screen.findByText("All Transactions")).toBeInTheDocument();

    axios.get.mockResolvedValue({
      data: {
        transactions: [
          {
            transactionId: "1692682523755",
            amount: -50,
            transactionType: "Debit",
            sender: "User B",
            receiver: "User A",
            transactionDate: "2023-08-24",
          },
        ],
        currentPage: 1,
        totalItems: 11,
        totalPages: 2,
      },
    });

    // Change page
    act(() => {
      screen.getByLabelText("Go to next page").click();
    });

    expect(await screen.findByText("1692682523755")).toBeInTheDocument();
    expect(await screen.findByText("50")).toBeInTheDocument();
    expect(await screen.findByText("Debit")).toBeInTheDocument();
    expect(await screen.findByText("User B")).toBeInTheDocument();
    expect(await screen.findByText("User A")).toBeInTheDocument();
    expect(await screen.findByText("Aug 24, 2023")).toBeInTheDocument();
  });

  it("displays positive amount in green and negative amount in red", async () => {
    render(<AllTransactionPage />);

    expect(await screen.findByText("All Transactions")).toBeInTheDocument();

    const positiveAmountElement = await screen.findByText("101");
    const negativeAmountElement = await screen.findByText("50");

    expect(positiveAmountElement).toHaveStyle("color: green");
    expect(negativeAmountElement).toHaveStyle("color: red");
  });

  // Add more test cases for search functionality, mobile view, etc.
  it("displays transaction details correctly in mobile version", async () => {
    // Set the viewport to simulate a mobile screen
    window.matchMedia = createMatchMedia(200);

    render(<AllTransactionPage />);

    // Verify that the mobile version renders correctly
    expect(await screen.findByText("All Transactions")).toBeInTheDocument();

    // Verify the transaction details
    const positiveAmountElement = await screen.findByText("101");
    const negativeAmountElement = await screen.findByText("50");

    expect(positiveAmountElement).toHaveStyle("color: green");
    expect(negativeAmountElement).toHaveStyle("color: red");

    // Simulate scrolling to test pagination
    fireEvent.scroll(window, { target: { scrollY: 1000 } });

    // Add more assertions or actions specific to the mobile version
  });
});
