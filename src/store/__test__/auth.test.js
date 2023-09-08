import reducer, { LOGIN, LOGOUT, selectUserData } from "../auth";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
describe("Store", () => {
  test("should handle a LOGOUT", () => {
    const initialState = {
      token: "test-token",
      username: "test-username",
      email: "test@example.com",
    };
    expect(reducer(initialState, LOGOUT())).toEqual({
      token: null,
      username: null,
      email: null,
    });
  });

  it("should handle LOGIN action", () => {
    const rootReducer = combineReducers({
      auth: reducer,
    });

    const store = configureStore({
      reducer: rootReducer,
    });

    const payload = {
      token: "test-token",
      username: "test-username",
      email: "test@example.com",
    };

    store.dispatch(LOGIN(payload));

    const state = store.getState().auth;

    expect(state.token).toBe(payload.token);
    expect(state.username).toBe(payload.username);
    expect(state.email).toBe(payload.email);
    expect(localStorage.getItem("Wallet__token")).toBe(payload.token);
    expect(localStorage.getItem("Wallet__email")).toBe(payload.email);
    expect(localStorage.getItem("Wallet__username")).toBe(payload.username);
  });

  it("should handle LOGOUT action", () => {
    const initialState = {
      token: "test-token",
      username: "test-username",
      email: "test@example.com",
    };

    const rootReducer = combineReducers({
      auth: reducer,
    });

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: { auth: initialState },
    });

    store.dispatch(LOGOUT());

    const state = store.getState().auth;

    expect(state.token).toBe(null);
    expect(state.username).toBe(null);
    expect(state.email).toBe(null);
    expect(localStorage.getItem("Wallet__token")).toBe(null);
    expect(localStorage.getItem("Wallet__email")).toBe(null);
    expect(localStorage.getItem("Wallet__username")).toBe(null);
  });

  it("should select user data", () => {
    const initialState = {
      token: "test-token",
      username: "test-username",
      email: "test@example.com",
    };

    const selected = selectUserData({ auth: initialState });

    expect(selected).toEqual(initialState);
  });
});
