import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { LOGIN } from "../store/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../resource/constants";
import axios from "axios";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import backgroundImage from "../resource/backgroundImage.avif";

const LoginPage = () => {
  const [values, setValues] = useState({
    username: localStorage.getItem("walletPlus-email") || "",
    password: localStorage.getItem("walletPlus-password") || "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [error, setError] = useState(false);
  const [passworderror, setPasswordError] = useState(false);
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const dispatch = useDispatch();
  const navigation = useNavigate();

  const handleChange = (prop) => (event) => {
    setPasswordError(false);
    setValues({ ...values, [prop]: event.target.value });
    // console.log(values);
  };
  const ASYNC_LOGIN = (userData) => {
    const authData = {
      userName: userData.username,
      password: userData.password,
    };
    let URL = BASE_URL + "/api/auth/login";
    axios
      .post(URL, authData)
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
        setSnackbarMessage("Login successful!");
        setSnackbarOpen(true);
        setError(false);

        navigation("/");
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setPasswordError(true);
          setError(true);
          setSnackbarMessage(err.response.data.message + "!");
          setSnackbarOpen(true);
        } else {
          setError(true);
          setSnackbarMessage(err.message + "!");
          setSnackbarOpen(true);
        }
      });
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();

    ASYNC_LOGIN({
      username: values.username,
      password: values.password,
    });
  };
  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) => t.palette.grey[50],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={formSubmitHandler}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Username"
                name="username"
                onChange={handleChange("username")}
                value={values.username}
                autoFocus
                placeholder="Username"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                placeholder="Password"
                name="password"
                label="Password"
                type="password"
                id="password"
                value={values.password}
                onChange={handleChange("password")}
                helperText={passworderror ? "Invalid Credentials" : ""}
                error={passworderror}
              />
              <div></div>
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    onChange={handleChange("remember")}
                  />
                }
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link to="/password-request" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/signUp" variant="body2">
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
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
          sx={{
            backgroundColor: error ? "#dac9f2" : "#4caf50",
            color: error ? "#ed0909" : "#ffffff",
          }}
        >
          <span style={{ fontWeight: "bold" }}>{snackbarMessage}</span>
        </MuiAlert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default LoginPage;
