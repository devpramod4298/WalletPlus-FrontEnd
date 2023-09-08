import { createMemoryHistory } from "history";
import { checkAuthLoader } from "../auth";

describe("checkAuthLoader", () => {
  it("redirects to /login if token is not present", () => {
    const history = createMemoryHistory();
    localStorage.removeItem("Wallet__token"); // Ensure no token

    checkAuthLoader(history);

    expect(history.location.pathname).toBe("/");
  });

  it("does not redirect if token is present", () => {
    const history = createMemoryHistory();
    localStorage.setItem("Wallet__token", "fake-token"); // Set a token

    checkAuthLoader(history);

    expect(history.location.pathname).not.toBe("/login");
  });
});
