import React, { useState } from "react";
import PropTypes from "prop-types";
import { AppBar, Tab, Tabs, Typography } from "@material-ui/core";
import FollowGrid from "./FollowGrid";
import PostList from "../post/PostList";

const ProfileTabs = (props) => {
  console.log("ProfileTabs props", props);
  const [tab, setTab] = useState(0);

  const handleChange = (event, value) => {
    setTab(value);
  };

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={tab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Posts" />
          <Tab label="Following" />
          <Tab label="Followers" />
        </Tabs>
      </AppBar>

      {tab === 0 && (
        <TabContainer>
          {" "}
          <PostList
            removeUpdate={props.removePostUpdate}
            posts={props.posts}
          />{" "}
        </TabContainer>
      )}
      {tab === 1 && (
        <TabContainer>
          <FollowGrid people={props.user.following} />
        </TabContainer>
      )}
      {tab === 2 && (
        <TabContainer>
          <FollowGrid people={props.user.followers} />
        </TabContainer>
      )}
    </div>
  );
};

ProfileTabs.propTypes = {
  user: PropTypes.object.isRequired,
};

const TabContainer = (props) => {
  return (
    <Typography component="div" style={{ padding: 8 * 2 }}>
      {props.children}
    </Typography>
  );
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProfileTabs;
