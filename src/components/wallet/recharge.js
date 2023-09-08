import { BASE_URL } from "../../resource/constants";
import { Box, Button, Snackbar, TextField, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import { useSelector } from "react-redux";
import { selectUserData } from "../../store/auth";
import { useNavigate } from "react-router-dom";

function WalletRechagePage() {
  const [amountError, setAmountError] = useState(true);
  const [amount, setAmount] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [error, setError] = useState(false);
  const currentuserData = useSelector(selectUserData);
  const navigation = useNavigate();
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const changeAmountInputEventHandler = (event) => {
    setAmount(event.target.value);
    const enteredAmount = event.target.value.trim();

    if (!enteredAmount || isNaN(enteredAmount) || enteredAmount <= 0) {
      setAmountError(true);
    } else {
      setAmountError(false);
    }
  };
  const onSubmitFormHandler = () => {
    const headers = { Authorization: currentuserData.token };
    const rechargeData = {
      username: "username",
      amount: parseFloat(amount),
    };
    let url = BASE_URL + "/wallet/recharge";

    axios
      .post(url, rechargeData, { headers })
      .then((response) => {
        setSnackbarMessage("Recharge successful!");
        setSnackbarOpen(true);
        setError(false);
        setTimeout(() => {
          navigation("/");
        }, 2000);
      })
      .catch((err) => {
        if (err.response && err.response.data) {
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

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "40vh",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        <Box sx={{ padding: "1rem 5rem" }}>
          <Typography variant="h4" component="h4">
            Recharge Wallet
          </Typography>
          <Box
            sx={{
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <TextField
                id="outlined-basic"
                label="Amount(in Rupees)"
                variant="outlined"
                placeholder="Enter Amount"
                value={amount}
                name="amount"
                onChange={changeAmountInputEventHandler}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ marginLeft: "0.5rem" }}
                disabled={amountError}
                onClick={onSubmitFormHandler}
              >
                Recharge
              </Button>
            </Box>
          </Box>
        </Box>
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

export default WalletRechagePage;
