import React, { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Icon,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { login } from "./api-auth.js";
import { authenticate } from "./auth-helper.js";
import { Redirect } from "react-router-dom";

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

const Login = (props) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    redirectToReferrer: false,
  });

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmiit = () => {
    const user = {
      email: values.email || undefined,
      password: values.password || undefined,
    };
    login(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        authenticate(data, () => {
          setValues({ ...values, error: "", redirectToReferrer: true });
        });
      }
    });
  };

  const { from } = props.location.state || {
    from: {
      pathname: "/",
    },
  };

  const { redirectToReferrer } = values;
  if (redirectToReferrer) {
    return <Redirect to={from} />;
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Login
          </Typography>
          <form noValidate>
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
    </div>
  );
};

export default Login;
