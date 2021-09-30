import React, { useState } from "react";
import {
  Avatar,
  Card,
  CardHeader,
  Icon,
  TextField,
  Typography,
} from "@material-ui/core";
import { isAuthenticated } from "../auth/auth-helper";
import { makeStyles } from "@material-ui/core";
import { API } from "../config";
import { comment } from "./api-post";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  smallAvatar: {},
  commentField: {},
  cardHeader: {},
  commentText: {},
  commentDate: {},
  commentDelete: {},
}));

const Comments = (props) => {
  console.log("props Comment", props);
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
      comment(_id, token, props.postId, text).then((data) => {
        if (data.error) {
          console.log("data.error addComment", data.error);
        } else {
          setText("");
          props.updateComments(data.comments);
        }
      });
    }
  };


  const deleteComment = comment => event => {
    uncomment(_id, token, props.postId, comment).then((data) => {
      if (data.error) {
        console.log('deleteComment data.error', data.error);
      } else {
        props.updateComments(data.comments);
      }
    })
  }

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
    <Card>
      <Typography>Coments</Typography>
      <CardHeader
        avatar={
          <Avatar
            className={classes.smallAvatar}
            src={`${API}/api/user/photo/${_id}`}
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
        }
      />
      {props.comments.map((item, i) => {
        return (
          <CardHeader
            avatar={
              <Avatar
                className={classes.smallAvatar}
                src={`${API}/user/photo/${item._id}`}
              />
            }
            title={commentBody(item)}
            className={classes.cardHeader}
            key={i}
          />
        );
      })}
    </Card>
  );
};

export default Comments;
