import { redirect } from "react-router-dom";

export function checkAuthLoader() {
  const token = localStorage.getItem("Wallet__token");
  if (!token) {
    return redirect("/login");
  } else return null;
}
