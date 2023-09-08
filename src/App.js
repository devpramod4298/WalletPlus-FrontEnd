import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Header from "./components/NavBar";
import UserProfile from "./components/wallet/UserProfile";
import LoginPage from "./components/Login";
import SignUpPage from "./components/Signup";
import { checkAuthLoader } from "./utils/auth";
import RootLayout from "./components/Root";
import TranferAmountPage from "./components/wallet/transfer";
import WalletRechagePage from "./components/wallet/recharge";
import ErrorPage from "./components/Error";
import LogOut from "./components/Logout";
import AllTransactionPage from "./components/wallet/allTranactionList";
import PasswordResetForm from "./components/PasswordReset";
import PasswordResetRequestForm from "./components/passwordResetRequest";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: "root",
    loader: checkAuthLoader,
    children: [
      { index: true, element: <UserProfile /> },
      {
        path: "all-transaction",
        element: <AllTransactionPage />,
      },
      {
        path: "transfer",
        element: <TranferAmountPage />,
      },
      {
        path: "recharge",
        element: <WalletRechagePage />,
      },
      {
        path: "logout",
        element: <LogOut />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <>
        <Header></Header> <LoginPage />
      </>
    ),
  },
  {
    path: "/signUp",
    element: (
      <>
        <Header /> <SignUpPage></SignUpPage>
      </>
    ),
  },
  {
    path: "/password-request",
    element: (
      <>
        <Header /> <PasswordResetRequestForm></PasswordResetRequestForm>
      </>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <>
        <Header /> <PasswordResetForm></PasswordResetForm>
      </>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
