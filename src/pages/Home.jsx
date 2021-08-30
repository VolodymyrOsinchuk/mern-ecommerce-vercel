import React from "react";
import { makeStyles } from "@material-ui/core";
import { Card, CardContent, CardMedia, Typography } from "@material-ui/core";
import himalayas from "../images/himalayas.jpg";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    marginTop: theme.spacing(5),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
  },
  media: {
    minHeight: 400,
  },
}));

const Home = () => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <Typography variant="h6" className={classes.title}>
        Home Page
      </Typography>
      <CardMedia
        className={classes.media}
        image={himalayas}
        title="Himalayas"
      />
      <CardContent variant="body2" component="p">
        <Typography>Bienvenue sur Home page</Typography>
      </CardContent>
    </Card>
  );
};

export default Home;
