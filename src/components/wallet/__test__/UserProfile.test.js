import React from "react";
import { render, screen } from "@testing-library/react";
import axios from "axios";
import UserProfile from "../UserProfile";
import { MemoryRouter } from "react-router-dom";

// Mock the axios module to return a fake response
jest.mock("axios");

describe("UserProfile", () => {
  it("renders user profile data correctly", async () => {
    axios.get.mockResolvedValue({
      data: {
        fullName: "John Doe",
        userName: "johndoe",
        emailId: "johndoe@example.com",
        walletAmount: 100.0,
      },
    });
    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );

    // Wait for the asynchronous axios call to complete
    await screen.findByText("John Doe");

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Username: johndoe")).toBeInTheDocument();
    expect(screen.getByText("Email: johndoe@example.com")).toBeInTheDocument();
    expect(
      screen.getByText("Wallet Amount(in Rupees): 100")
    ).toBeInTheDocument();
    expect(screen.getByText("Add Funds")).toBeInTheDocument();
  });

  it("displays a link to /recharge", async () => {
    axios.get.mockResolvedValue({
      data: {
        fullName: "John Doe",
        userName: "johndoe",
        emailId: "johndoe@example.com",
        walletAmount: 100.0,
      },
    });
    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );
    // Wait for the asynchronous axios call to complete
    await screen.findByText("Add Funds");

    const linkElement = screen.getByText("Add Funds");
    expect(linkElement).toHaveAttribute("href", "/recharge");
  });
});
