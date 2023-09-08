import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../resource/constants";
import { Grid, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { useDispatch } from "react-redux";
import { LOGIN } from "../store/auth";

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
  const regex_pass =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,20}$/;
  return regex_pass.test(password);
}

const defaultTheme = createTheme();

export default function SignUpPage() {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    accountNo: "",
  });

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [confirmPasswordError, setConfirmPassworderror] = useState(false);
  const [accountNoError, setAccountNoError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  function extractUsernameFromEmail(email) {
    // Use a regular expression to check if the email address is in the "username" format (no '@' symbol)
    if (!email.includes("@")) {
      return email; // Return the email itself as the username
    }

    // Use a regular expression to match the username part before the '@' symbol
    const usernameMatch = email.match(/^(.+)@/);

    // Check if a match was found
    if (usernameMatch && usernameMatch.length === 2) {
      return usernameMatch[1];
    } else {
      // If no match was found, assume the email is the username
      return email;
    }
  }
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    if (prop === "password") {
      if (!validatePassword(event.target.value)) setPasswordError(true);
      else setPasswordError(false);
      return;
    }
    if (prop === "email") {
      if (!validateEmail(event.target.value)) setEmailError(true);
      else setEmailError(false);
      const username = extractUsernameFromEmail(event.target.value);
      setValues({ ...values, username: username, email: event.target.value });
      return;
    }
    if (prop === "confirmPassword") {
      if (values.password === event.target.value) {
        setConfirmPassworderror(false);
      } else setConfirmPassworderror(true);
    }
    if (prop === "phoneNumber") {
      if (event.target.value.length === 10) setPhoneNumberError(false);
      else {
        setPhoneNumberError(true);
      }
    }
    if (prop === "accountNo") {
      if (event.target.value.length === 16) setAccountNoError(false);
      else setAccountNoError(true);
    }
  };
  const submitFormHandler = (e) => {
    e.preventDefault();
    const userdata = {
      userName: values.username,
      fullName: values.fullName,
      emailId: values.email,
      password: values.password,
      phoneNumber: values.phoneNumber,
      address: values.address,
      accountNo: values.accountNo,
    };
    let url = BASE_URL + "/api/auth/register";

    axios
      .post(url, userdata)
      .then((response) => {
        const token = response.data.token;
        const email = response.data.email;
        const username = response.data.username;
        dispatch(
          LOGIN({
            token: token,
            username: username,
            email: email,
          })
        );
        navigation("/");
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setError(true);
          setSnackbarMessage(err.response.data.error + "!");
          setSnackbarOpen(true);
        } else {
          setError(true);
          setSnackbarMessage(err.message + "!");
          setSnackbarOpen(true);
        }
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={submitFormHandler}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="FullName"
              label="Full Name"
              placeholder="Enter Full Name"
              name="fullName"
              onChange={handleChange("fullName")}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              placeholder="Enter Email Address"
              name="email"
              onChange={handleChange("email")}
              helperText={emailError ? "Invalid Email" : ""}
              error={emailError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="username"
              name="username"
              value={values.username}
              placeholder="Enter Username"
              onChange={handleChange("username")}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              placeholder="Enter Password"
              label="Password"
              type="password"
              id="password"
              onChange={handleChange("password")}
              helperText={
                passwordError
                  ? "Password should contain one uppercase, lowercase, digit,sepecial charecter."
                  : ""
              }
              error={passwordError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirm Password"
              placeholder="Confirm Password"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              onChange={handleChange("confirmPassword")}
              helperText={
                confirmPasswordError
                  ? "Confirm Password should be same as password."
                  : ""
              }
              error={confirmPasswordError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="PhoneNumber"
              placeholder="Phone Number"
              label="Phone Number"
              type="text"
              id="phoneNumber"
              value={values.phoneNumber}
              onChange={handleChange("phoneNumber")}
              helperText={
                phoneNumberError ? "Phone Number Should be of 10 digits." : ""
              }
              error={phoneNumberError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="accountNumber"
              placeholder="1234567890121111"
              label="Account Number"
              type="text"
              id="accountNo"
              value={values.accountNo}
              onChange={handleChange("accountNo")}
              helperText={
                accountNoError ? "Account Number Should be of 16 digits." : ""
              }
              error={accountNoError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="address"
              placeholder="Address"
              label="Address"
              type="text"
              id="address"
              onChange={handleChange("address")}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={
                passwordError ||
                confirmPasswordError ||
                emailError ||
                accountNoError ||
                phoneNumberError ||
                values.confirmPassword.length === 0
              }
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link to="/login" variant="body2">
                  Already have an account? Log in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={error ? "error" : "success"}
        >
          <span style={{ fontWeight: "bold" }}>{snackbarMessage}</span>
        </MuiAlert>
      </Snackbar>
    </ThemeProvider>
  );
}
