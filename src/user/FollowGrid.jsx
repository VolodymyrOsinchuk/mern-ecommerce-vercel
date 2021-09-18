import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, GridList, GridListTile, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyle = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
  },
  gridList: {},
}));

const FollowGrid = (props) => {
  const classes = useStyle();
  console.log("FollowGrid props", props);

  return (
    <div className={classes.root}>
      <GridList cellHeight={160} className={classes.gridList} cols={4}>
        {props.people.map((person, i) => {
          console.log("person", person);
          return (
            <GridListTile key={i}>
              <Link to={`/user/${person._id}`}>
                <Avatar src={`/api/users/photo/${person._id}`} />
                <Typography>{person.name}</Typography>
              </Link>
            </GridListTile>
          );
        })}
      </GridList>
    </div>
  );
};

FollowGrid.propTypes = {
  people: PropTypes.array.isRequired,
};

export default FollowGrid;
