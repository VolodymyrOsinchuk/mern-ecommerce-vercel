import React from "react";
import PropTypes from "prop-types";
import Post from "./Post";

const PostList = (props) => {
  console.log("postlist props", props);
  return (
    <div style={{ marginTop: "24px" }}>
      {props.posts.map((item, i) => {
        return <Post key={i} post={item} onRemove={props.removeUpdate} />;
      })}
    </div>
  );
};

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  removeUpdate: PropTypes.func.isRequired,
};

export default PostList;
