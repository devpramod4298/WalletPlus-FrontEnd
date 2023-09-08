import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { BASE_URL } from "../resource/constants";
import axios from "axios";
import { Grid, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Link, useLocation } from "react-router-dom";

const PasswordResetForm = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const fullname = searchParams.get("name");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const [isValidPassword, setIsValidPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    // Check if the password meets the criteria
    const regex_pass =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,20}$/;
    setIsValidPassword(regex_pass.test(formData.password));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const token = searchParams.get("token");
    const headers = { Authorization: token };
    const url = BASE_URL + "/api/auth/password-reset-confirmation";
    axios
      .post(url, { password: formData.password }, { headers })
      .then((response) => {
        setSnackbarMessage("password Changed sucessfully!");
        setFormData({ password: "", confirmPassword: "" });
        setSnackbarOpen(true);
      });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
        }}
      >
        <Typography variant="h4" gutterBottom>
          {fullname}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            required
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            required
            fullWidth
            label="Confirm Password"
            type="password"
            variant="outlined"
            margin="normal"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={
              !isValidPassword || formData.password !== formData.confirmPassword
            }
          >
            Reset Password
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/login" variant="body2">
                Go to Login Page
              </Link>
            </Grid>
            {/* <Grid item>
              {isButtonDisabled && <p>Resend in {timer} seconds</p>}
            </Grid> */}
          </Grid>
        </form>
      </Box>
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
          severity="success"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default PasswordResetForm;
