import { Outlet } from "react-router-dom";
import Header from "./NavBar";
import { useEffect } from "react";
import { LOGIN } from "../store/auth";
import { useDispatch } from "react-redux";

function RootLayout() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("Wallet__token");
    const userId = localStorage.getItem("Wallet__userId");
    const username = localStorage.getItem("Wallet__username");
    const email = localStorage.getItem("Wallet__email");
    dispatch(
      LOGIN({
        token: token,
        userId: userId,
        username: username,
        email: email,
      })
    );
  }, [dispatch]);
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default RootLayout;
