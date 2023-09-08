import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, useRouteError } from "react-router-dom";
import ErrorPage from "../Error";
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // Use the actual react-router-dom module
  useRouteError: jest.fn(), // Mock the useRouteError hook
}));
describe("ErrorPage component", () => {
  it("displays a generic error message for unknown errors", () => {
    useRouteError.mockReturnValue({
      status: 401,
      data: {
        message: "Internal server error",
      },
    });
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );
    const titleElement = screen.getByText(/An error occurred/i);
    const messageElement = screen.getByText(/Something went wrong/i);

    expect(titleElement).toBeInTheDocument();
    expect(messageElement).toBeInTheDocument();
  });

  it("displays a custom error message for status code 500", () => {
    useRouteError.mockReturnValue({
      status: 500,
      data: {
        message: "Internal server error",
      },
    });
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );
    const titleElement = screen.getByText(/An error occurred/i);
    const messageElement = screen.getByText(/Internal server error/i);

    expect(titleElement).toBeInTheDocument();
    expect(messageElement).toBeInTheDocument();
    // Similar setup for other test cases
  });

  it("displays a custom error message for status code 404", () => {
    useRouteError.mockReturnValue({
      status: 404,
    });
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );
    const titleElement = screen.getByText(/Not found!/i);
    const messageElement = screen.getByText(/Could not find resource or page./i);

    expect(titleElement).toBeInTheDocument();
    expect(messageElement).toBeInTheDocument();
  });
});
