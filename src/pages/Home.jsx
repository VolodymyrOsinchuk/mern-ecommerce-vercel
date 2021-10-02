import React, { useEffect, useState } from "react";
import { Grid, makeStyles } from "@material-ui/core";
import { Card, CardContent, CardMedia, Typography } from "@material-ui/core";
import himalayas from "../images/himalayas.jpg";
import Newsfeed from "../post/Newsfeed";
import FindPeople from "../user/FindPeople";
import { isAuthenticated } from "../auth/auth-helper";

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

const Home = ({ history }) => {
  // console.log("Home history", history);
  const classes = useStyles();
  const [defaultPage, setDefaultPage] = useState(false);

  useEffect(() => {
    setDefaultPage(isAuthenticated());
    const unlisten = history.listen(() => {
      setDefaultPage(isAuthenticated());
    });

    // console.log("unlisten", unlisten);
    return () => {
      unlisten();
    };
  }, []);

  return (
    <div>
      {!defaultPage && (
        <Card className={classes.card}>
          <Typography variant="h6" className={classes.title}>
            Home Page
          </Typography>
          <CardMedia
            className={classes.media}
            image={himalayas}
            title="Himalayas"
          />
          <CardContent variant="body2" component="h6">
            <Typography>Bienvenue sur Home page</Typography>
          </CardContent>
        </Card>
      )}
      {defaultPage && (
        <Grid container spacing={8}>
          <Grid item xs={8} sm={7}>
            <Newsfeed />
          </Grid>
          <Grid item xs={6} sm={5}>
            <FindPeople />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Home;
