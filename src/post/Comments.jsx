import React, { useState } from "react";
import PropTypes from "prop-types";
import { Avatar, CardHeader, Icon, TextField } from "@material-ui/core";
import { isAuthenticated } from "../auth/auth-helper";
import { makeStyles } from "@material-ui/core";
import { API } from "../config";
import { comment, uncomment } from "./api-post";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  smallAvatar: {
    height: 25,
    width: 25,
  },
  commentField: {
    width: "96%",
  },
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  commentText: {
    backgroundColor: "white",
    padding: theme.spacing(1),
    margin: `2px ${theme.spacing(2)}px 2px 2px`,
  },
  commentDate: {
    display: "block",
    color: "gray",
    fontSize: "0.8em",
  },
  commentDelete: {
    fontSize: "1.6em",
    verticalAlign: "middle",
    cursor: "pointer",
  },
}));

const Comments = (props) => {
  // console.log("props Comment", props);
  const classes = useStyles();
  const [text, setText] = useState("");

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const {
    user: { _id },
    token,
  } = isAuthenticated();

  const addComment = (event) => {
    if (event.keyCode === 13 && event.target.value) {
      event.preventDefault();
      comment(_id, token, props.postId, { text: text }).then((data) => {
        console.log("addComment data", data);
        if (data.error) {
          console.log("data.error addComment", data.error);
        } else {
          setText("");
          props.updateComments(data.comments);
        }
      });
    }
  };

  const deleteComment = (comment) => (event) => {
    uncomment(_id, token, props.postId, comment).then((data) => {
      console.log("data daleteComment", data);
      if (data.error) {
        console.log("deleteComment data.error", data.error);
      } else {
        props.updateComments(data.comments);
      }
    });
  };

  const commentBody = (item) => {
    return (
      <p className={classes.commentText}>
        <Link to={`${API}/user/${item.postedBy._id}`}>
          {item.postedBy.name}
        </Link>
        <br />
        {item.text}
        <span className={classes.commentDate}>
          {new Date(item.created).toDateString()}
          {isAuthenticated().user._id === item.postedBy._id && (
            <Icon
              onClick={deleteComment(item)}
              className={classes.commentDelete}
            >
              delete
            </Icon>
          )}
        </span>
      </p>
    );
  };

  return (
    <div>
      <CardHeader
        avatar={
          <Avatar
            className={classes.smallAvatar}
            src={`${API}/api/user/photo/${_id}`}
          />
        }
        title={
          <TextField
            onKeyDown={addComment}
            multiline
            value={text}
            onChange={handleChange}
            placeholder="Ecrivez votre commentaire..."
            className={classes.commentField}
            margin="normal"
          />
        }
        className={classes.cardHeader}
      />
      {props.comments.map((item, i) => {
        console.log("comments item", item);
        return (
          <CardHeader
            avatar={
              <Avatar
                className={classes.smallAvatar}
                src={`${API}/api/user/photo/${_id}`}
              />
            }
            title={commentBody(item)}
            className={classes.cardHeader}
            key={i}
          />
        );
      })}
    </div>
  );
};

Comments.propTypes = {
  postId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  updateComments: PropTypes.func.isRequired,
};

export default Comments;
