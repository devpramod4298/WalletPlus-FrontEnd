import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom"; // Import Routes
import PasswordResetForm from "../PasswordReset";

jest.mock("axios");

describe("PasswordResetForm", () => {
  it("should render correctly with valid fullname", () => {
    render(
      <MemoryRouter initialEntries={["/reset-password?name=John"]}>
        <Routes>
          {" "}
          {/* Wrap Routes around your routes */}
          <Route path="/reset-password" element={<PasswordResetForm />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reset Password" })
    ).toBeInTheDocument();
  });

  // Other test cases...

  it("should submit the form and show success message on successful password reset", async () => {
    render(
      <MemoryRouter initialEntries={["/reset-password?Full%20name=John"]}>
        <Routes>
          <Route path="/reset-password" element={<PasswordResetForm />} />
        </Routes>
      </MemoryRouter>
    );

    axios.post.mockResolvedValueOnce({});

    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Reset Password" });

    fireEvent.change(passwordInput, { target: { value: "ValidPassword123!" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "ValidPassword123!" },
    });
    fireEvent.click(submitButton);

    // Check if the success message is displayed
    await waitFor(() => {
      expect(
        screen.getByText("password Changed sucessfully!")
      ).toBeInTheDocument();
    });

    // Check if the form fields are cleared
    expect(passwordInput).toHaveValue("");
    expect(confirmPasswordInput).toHaveValue("");
  });
});
