import React, { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  Icon,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { create } from "../user/api-user";
import { DialogActions } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
    backgroundColor: "lightgrey",
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
  title: {
    marginTop: theme.spacing(2),
  },
  error: {
    verticalAlign: "middle",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
}));

const Register = () => {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    open: false,
    error: "",
  });

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmiit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
    };
    create(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, open: true });
      }
    });
  };

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Register
          </Typography>
          <form noValidate>
            <TextField
              label="Nom"
              margin="normal"
              autoComplete="name"
              value={values.name}
              onChange={handleChange("name")}
              className={classes.textField}
            />
            <br />
            <TextField
              label="Email"
              margin="normal"
              autoComplete="email"
              value={values.email}
              onChange={handleChange("email")}
              className={classes.textField}
            />
            <br />
            <TextField
              label="Mot de passe"
              type="password"
              autoComplete="current-password"
              margin="normal"
              value={values.password}
              onChange={handleChange("password")}
              className={classes.textField}
            />
            <br />
            {values.error && (
              <Typography component="p" color="error">
                <Icon color="error" className={classes.error}>
                  error
                </Icon>
                {values.error}
              </Typography>
            )}
          </form>
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={clickSubmiit}
            className={classes.submit}
          >
            S'enregistrer
          </Button>
        </CardActions>
      </Card>

      <Dialog open={values.open} onClose={() => true}>
        <DialogTitle>Nouveau compte</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Nouveau compte est crée avec succès
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/login">
            <Button color="primary" variant="contained">
              S'indententifier
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Register;
