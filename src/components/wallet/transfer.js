import { BASE_URL } from "../../resource/constants";
import { Box, Button, Snackbar, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import { useSelector } from "react-redux";
import { selectUserData } from "../../store/auth";
import { useNavigate } from "react-router-dom";

function TranferAmountPage() {
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [error, setError] = useState(false);

  const [amountError, setAmountError] = useState(true);

  const userData = useSelector(selectUserData);
  const navigation = useNavigate();
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const usernameChangeHandler = (event) => {
    setUsername(event.target.value);
  };

  const changeAmountInputEventHandler = (event) => {
    setAmount(event.target.value);
    if (event.target.value.trim().length > 0) {
      setAmountError(false);
    }
  };
  const onSubmitFormHandler = () => {
    const token = userData.token;
    const headers = { Authorization: token };
    const rechargeData = {
      reciver: username,
      tranferamount: parseFloat(amount),
    };
    let url = BASE_URL + "/wallet/transfer";

    axios
      .post(url, rechargeData, { headers })
      .then((response) => {
        setSnackbarMessage("Transfer Done!");
        setSnackbarOpen(true);
        setError(false);
        setTimeout(() => {
          navigation("/");
        }, 2000);
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setError(true);
          setSnackbarMessage(err.response.data + "!");
          setSnackbarOpen(true);
        } else {
          setError(true);
          setSnackbarMessage(err.message + "!");
          setSnackbarOpen(true);
        }
      });
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          minHeight: "40vh",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          border: "1px solid #ccc",
        }}
      >
        <Box noValidate sx={{ mt: 1, maxWidth: "400px" }}>
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="username"
            variant="outlined"
            placeholder="Enter UserName"
            value={username}
            name="username"
            onChange={usernameChangeHandler}
            autoFocus
            required
          />
          <TextField
            margin="normal"
            fullWidth
            id="amount"
            label="Amount(in Rupees)"
            variant="outlined"
            placeholder="Enter Amount"
            value={amount}
            name="amount"
            onChange={changeAmountInputEventHandler}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!(username && !amountError)}
            onClick={onSubmitFormHandler}
          >
            Transfer
          </Button>
        </Box>
        {/* <Snackbar open={isProcessed} message={displayResult} /> */}
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
          severity={error ? "error" : "success"}
          sx={{
            backgroundColor: error ? "#dac9f2" : "#4caf50",
            color: error ? "#ed0909" : "#ffffff",
          }}
        >
          <span style={{ fontWeight: "bold" }}>{snackbarMessage}</span>
        </MuiAlert>
      </Snackbar>
    </>
  );
}

export default TranferAmountPage;
