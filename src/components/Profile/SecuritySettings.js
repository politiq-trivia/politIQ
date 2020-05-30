import React from "react";
import { auth } from "../../firebase";
import PasswordChangeForm from "../Auth/PasswordChange";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

const SecuritySettings = props => {
  const [open, setOpen] = React.useState(false);
  const [deleteAccountInputs, setDeleteAccountInputs] = React.useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteUser = () => {
    const email = deleteAccountInputs.email;
    const password = deleteAccountInputs.password;
    auth.deleteUser(email, password);
  };

  const handleDeleteAccountInputChange = event => {
    event.persist();
    setDeleteAccountInputs(deleteAccountInputs => ({
      ...deleteAccountInputs,
      [event.target.name]: event.target.value
    }));
  };

  return (
    <>
      <h1 id="settings-heading">Security Settings</h1>
      <h3 className="settings-subheading">Reset Your Password</h3>
      <PasswordChangeForm />
      <Button onClick={handleClickOpen} id="delete-account-button">
        <span style={{ color: "red" }}>Delete Account</span>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Account?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action is irreversible. Reauthenticate to permanently delete
            your account.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            onChange={handleDeleteAccountInputChange}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            name="password"
            label="password"
            type="password"
            onChange={handleDeleteAccountInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Keep account for now
          </Button>
          <Button onClick={handleDeleteUser} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SecuritySettings;
