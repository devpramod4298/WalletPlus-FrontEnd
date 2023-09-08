import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import axios from "axios";
import { Grid, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { BASE_URL } from "../resource/constants";
import { Link } from "react-router-dom";

const PasswordResetRequestForm = () => {
  const [formData, setFormData] = useState({
    emailId: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const [timer, setTimer] = useState(30); // Initial timer value in seconds
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsButtonDisabled(false);
    }

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendMailAgain = (event) => {
    event.preventDefault();
    sendMail(formData);
    setIsButtonDisabled(true);
    setTimer(30); // Reset the timer to 30 seconds
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  function sendMail(formData) {
    const url = BASE_URL + "/api/auth/password-reset-request";
    axios
      .post(url, formData)
      .then((response) => {})
      .catch((err) => {
        setSnackbarMessage("Please check your mail!");
        setSnackbarOpen(true);
      });
    setSnackbarMessage("Please check your mail!");
    setSnackbarOpen(true);
  }

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
          Reset password
        </Typography>
        <form>
          <TextField
            required
            fullWidth
            label="Email Address"
            type="email"
            variant="outlined"
            margin="normal"
            name="emailId"
            placeholder="Email Address"
            value={formData.emailId}
            onChange={handleChange}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSendMailAgain}
            disabled={isButtonDisabled}
          >
            Send mail
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/login" variant="body2">
                Go to Login Page
              </Link>
            </Grid>
            <Grid item>
              {isButtonDisabled && <p>Resend in {timer} seconds</p>}
            </Grid>
          </Grid>
        </form>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={10000}
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

export default PasswordResetRequestForm;
