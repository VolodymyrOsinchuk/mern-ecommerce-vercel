import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { clearJWT, isAuthenticated } from "../auth/auth-helper.js";
import { remove } from "./api-user.js";
import { Redirect } from "react-router-dom";

const DeleteUser = (props) => {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);
  console.log("props", props);

  const { token } = isAuthenticated();

  const clickButton = () => {
    setOpen(true);
  };

  const handleRequestClose = () => {
    setOpen(false);
  };

  const deleteAccount = () => {
    remove(props.userId, token).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        clearJWT(() => console.log("le compte a été suprimmé"));
        setRedirect(true);
      }
    });
  };

  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <span>
      <IconButton color="secondary" onClick={clickButton}>
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle style={{ margin: "auto" }}>
          {"Supprimer le compte"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vous confirmez suppression de votre compte?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleRequestClose}>
            Annuler
          </Button>
          <Button
            color="secondary"
            onClick={deleteAccount}
            autoFocus="autoFocus"
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
};

DeleteUser.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default DeleteUser;
