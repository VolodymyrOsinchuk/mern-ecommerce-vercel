import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  ImageList,
  ImageListItem,
  Typography,
} from "@material-ui/core";
import { API } from "../config.js";

const useStyle = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    background: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 220,
  },
  titleText: {
    textAlign: "center",
    marginTop: 10,
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: "auto",
  },
}));

const FollowGrid = (props) => {
  const classes = useStyle();
  console.log("FollowGrid props", props);

  return (
    <div className={classes.root}>
      <ImageList rowHeight={160} className={classes.gridList} cols={4}>
        {props.people.map((person, i) => {
          console.log("person", person);
          return (
            <ImageListItem key={i} style={{ height: 120 }}>
              <Link to={`/profile/${person._id}`}>
                <Avatar
                  src={`${API}/api/user/photo/${person._id}`}
                  className={classes.bigAvatar}
                />
                <Typography className={classes.titleText}>
                  {person.name}
                </Typography>
              </Link>
            </ImageListItem>
          );
        })}
      </ImageList>
    </div>
  );
};

FollowGrid.propTypes = {
  people: PropTypes.array.isRequired,
};

export default FollowGrid;
