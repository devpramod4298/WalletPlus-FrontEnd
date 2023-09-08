import { Link } from "react-router-dom";
import classes from "./UserProfile.module.css";
import { useEffect, useState } from "react";
import { Avatar, Box, Typography } from "@mui/material";

import { BASE_URL } from "../../resource/constants";
import axios from "axios";

const UserProfile = () => {
  const [profileData, setprofiledata] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("Wallet__token");
    const headers = { Authorization: token };
    let url = BASE_URL + "/wallet/show-balance";
    axios.get(url, { headers }).then((response) => {
      setprofiledata(response.data);
    });
  }, []);
  return (
    <main className={classes.profile}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
        }}
      >
        <Avatar sx={{ width: 100, height: 100, mb: 2 }} align="center" />
        <Typography variant="h4" gutterBottom align="center">
          {profileData.fullName}
        </Typography>
        <Box>
          <Typography variant="body1" gutterBottom align="left">
            Username: {profileData.userName}
          </Typography>
          <Typography variant="body1" gutterBottom align="left">
            Email: {profileData.emailId}
          </Typography>
          <Typography variant="body1" gutterBottom align="left">
            Phone No: {profileData.phoneNumber}
          </Typography>
          <Typography variant="body1" gutterBottom align="left">
            Address: {profileData.address}
          </Typography>
          <Typography variant="body1" gutterBottom align="left">
            Account No: {profileData.accountNo}
          </Typography>
          <Typography variant="body1" gutterBottom align="left">
            Wallet Amount(in Rupees): {parseFloat(profileData.walletAmount)}
          </Typography>
          <Typography variant="body2" gutterBottom align="left">
            <Link to="/recharge">Add Funds</Link>
          </Typography>
        </Box>
      </Box>
    </main>
  );
};

export default UserProfile;
