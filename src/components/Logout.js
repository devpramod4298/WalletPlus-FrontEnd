import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LOGOUT } from "../store/auth";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px  #000",
  boxShadow: 24,
  p: 4,
};

export default function LogOut() {
  const [open, setOpen] = React.useState(true);
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
    window.history.back();
  };
  const handleConfirm = () => {
    setOpen(false);
    dispatch(LOGOUT({}));
    navigation("");
  };
  const handleCancel = () => {
    setOpen(false);
    window.history.back();
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 id="logout-modal">Are you sure, you want to log out?</h2>
          <Button
            variant="contained"
            style={{ margin: "5px" }}
            onClick={handleConfirm}
            color="primary"
          >
            Yes
          </Button>{" "}
          <Button variant="outlined" onClick={handleCancel} color="secondary">
            No
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
