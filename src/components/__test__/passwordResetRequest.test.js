import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import PasswordResetRequestForm from "../passwordResetRequest";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
jest.mock("axios");
describe("PasswordResetRequestForm", () => {
  it("should render correctly", () => {
    render(
      <BrowserRouter>
        <PasswordResetRequestForm />
      </BrowserRouter>
    );

    // Check if the form elements are present
    expect(screen.getByText("Reset password")).toBeInTheDocument();
    expect(screen.getByText("Send mail")).toBeInTheDocument();
    expect(screen.getByText("Go to Login Page")).toBeInTheDocument();
  });

  it("should submit the form", async () => {
    // Mock the axios.post function
    const axiosMock = jest.spyOn(require("axios"), "post");
    axiosMock.mockResolvedValueOnce({
      data: {
        msg: "some text",
      },
    }); // Mock a successful response

    render(
      <BrowserRouter>
        <PasswordResetRequestForm />
      </BrowserRouter>
    );

    // Fill in the email input field
    const emailInput = screen.getByPlaceholderText("Email Address");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    const sendMailButton = screen.getByText("Send mail");
    act(() => {
      sendMailButton.click();
    });

    // Check if the axios.post function was called with the correct data
    await waitFor(() => {
      expect(axiosMock).toHaveBeenCalledWith(expect.any(String), {
        emailId: "test@example.com",
      });
    });

    // Check if success message is displayed
    expect(
      screen.getByText("Please check your mail!", { exact: false })
    ).toBeInTheDocument();
  });
  jest.useFakeTimers();

  it("should display the timer and disable the button during countdown", () => {
    axios.post.mockResolvedValue({
      data: {
        msg: "some text",
      },
    });
    render(
      <BrowserRouter>
        <PasswordResetRequestForm />
      </BrowserRouter>
    );
    const sendMailButton = screen.getByRole("button", { name: "Send mail" });

    // Click the button to initiate the countdown
    act(() => {
      sendMailButton.click();
      jest.advanceTimersByTime(1000);
    });

    // Check if the timer is displayed
    // expect(screen.getByText("Resend in ")).toBeInTheDocument();

    // Check if the button is disabled
    expect(sendMailButton).toBeDisabled();

    // Fast-forward the timers by 1 second
    // act(() => {
    //   jest.advanceTimersByTime(1000);
    // });

    // Check if the timer updates
    expect(screen.getByText("Resend in 29 seconds")).toBeInTheDocument();
  });
  it("should handle error response from backend", () => {
    axios.post.mockRejectedValue({
      response: {
        data: {
          message: "Invalid credentials",
        },
      },
    });
    render(
      <BrowserRouter>
        <PasswordResetRequestForm />
      </BrowserRouter>
    );
    const sendMailButton = screen.getByRole("button", { name: "Send mail" });

    // Click the button to initiate the countdown
    act(() => {
      sendMailButton.click();
      jest.advanceTimersByTime(1000);
    });
    // Check if the button is disabled
    expect(sendMailButton).toBeDisabled();

    // Check if the timer updates
    expect(screen.getByText("Resend in 29 seconds")).toBeInTheDocument();
  });
  it("should disable the button after 30 seconds of button click", () => {
    axios.post.mockResolvedValue({
      data: {
        msg: "some text",
      },
    });
    render(
      <BrowserRouter>
        <PasswordResetRequestForm />
      </BrowserRouter>
    );
    const sendMailButton = screen.getByRole("button", { name: "Send mail" });

    // Click the button to initiate the countdown
    act(() => {
      sendMailButton.click();
      jest.advanceTimersByTime(30000);
    });
    // Check if the button is disabled
    expect(sendMailButton).not.toBeDisabled();
  });
});
