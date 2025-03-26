import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Button,
  IconButton,
  Divider,
  TextField,
  CircularProgress,
  Tabs,
  Tab,
  Stack,
  Chip,
  Skeleton,
  Alert,
  Snackbar,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  Favorite,
  FavoriteBorder,
  Comment,
  Share,
  Person,
  Add,
  Refresh,
  Whatshot,
  AccessTime,
  PeopleOutline,
} from '@mui/icons-material'
import { isAuthenticated } from '../auth/auth-helper'
import { listNewsFeed, create, like, unlike } from '../post/api-post'
// import { listSuggested } from '../user/api-user'
import { API } from '../config'
import PostCreateForm from '../post/PostCreateForm'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedLoading, setFeedLoading] = useState(false)
  const [error, setError] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const [newPostContent, setNewPostContent] = useState('')

  const navigate = useNavigate()
  const auth = isAuthenticated()

  useEffect(() => {
    if (!auth) {
      navigate({ to: '/login' })
      return
    }

    loadFeed()
    // loadSuggestedUsers()
  }, [])

  const loadFeed = async () => {
    try {
      setFeedLoading(true)
      const data = await listNewsFeed({ userId: auth.user._id }, auth.token)

      if (data.error) {
        setError(data.error)
      } else {
        setPosts(data)
      }
    } catch (err) {
      setError('Could not load posts')
      console.error(err)
    } finally {
      setLoading(false)
      setFeedLoading(false)
    }
  }

  const loadSuggestedUsers = async () => {
    try {
      const data = await listSuggested({ userId: auth.user._id }, auth.token)

      if (data.error) {
        console.error(data.error)
      } else {
        setSuggestedUsers(data)
      }
    } catch (err) {
      console.error('Error loading suggested users:', err)
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handlePostCreate = async () => {
    if (!newPostContent.trim()) return

    try {
      const data = await create(
        {
          text: newPostContent,
          userId: auth.user._id,
        },
        auth.token
      )

      if (data.error) {
        setError(data.error)
      } else {
        setNewPostContent('')
        setPosts([data, ...posts])
      }
    } catch (err) {
      setError('Could not create post')
      console.error(err)
    }
  }

  const handlePostLike = async (postId, index) => {
    try {
      const response = await like({ userId: auth.user._id }, auth.token, postId)

      if (response.error) {
        setError(response.error)
      } else {
        const updatedPosts = [...posts]
        updatedPosts[index].likes.push(auth.user._id)
        setPosts(updatedPosts)
      }
    } catch (err) {
      setError('Could not like post')
      console.error(err)
    }
  }

  const handlePostUnlike = async (postId, index) => {
    try {
      const response = await unlike(
        { userId: auth.user._id },
        auth.token,
        postId
      )

      if (response.error) {
        setError(response.error)
      } else {
        const updatedPosts = [...posts]
        updatedPosts[index].likes = updatedPosts[index].likes.filter(
          (id) => id !== auth.user._id
        )
        setPosts(updatedPosts)
      }
    } catch (err) {
      setError('Could not unlike post')
      console.error(err)
    }
  }

  if (!auth) {
    return null // Already redirecting in useEffect
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        {/* Left sidebar - User profile summary */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar
              src={
                auth.user._id
                  ? `${API}/api/user/photo/${
                      auth.user._id
                    }?${new Date().getTime()}`
                  : null
              }
              sx={{ width: 80, height: 80, mb: 2 }}
            >
              <Person fontSize="large" />
            </Avatar>

            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {auth.user.name}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              @{auth.user.name.toLowerCase().replace(/\s/g, '_')}
            </Typography>

            <Divider sx={{ width: '100%', my: 1 }} />

            <Stack
              direction="row"
              spacing={2}
              sx={{ mb: 1, width: '100%', justifyContent: 'center' }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Posts
                </Typography>
                <Typography variant="h6">{auth.user.posts || 0}</Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Following
                </Typography>
                <Typography variant="h6">
                  {auth.user.following ? auth.user.following.length : 0}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Followers
                </Typography>
                <Typography variant="h6">
                  {auth.user.followers ? auth.user.followers.length : 0}
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() =>
                navigate({
                  to: `/profile/$userId`,
                  params: { userId: auth.user._id },
                })
              }
            >
              View Profile
            </Button>
          </Paper>

          {/* Suggested users */}
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Suggested Users
            </Typography>

            {suggestedUsers.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', py: 2 }}
              >
                No suggestions available
              </Typography>
            ) : (
              <Stack spacing={2}>
                {suggestedUsers.map((user) => (
                  <Card key={user._id} variant="outlined" sx={{ mb: 1 }}>
                    <CardHeader
                      avatar={
                        <Avatar
                          src={`${API}/api/user/photo/${
                            user._id
                          }?${new Date().getTime()}`}
                          sx={{ width: 40, height: 40 }}
                        >
                          {user.name[0]}
                        </Avatar>
                      }
                      title={user.name}
                      titleTypographyProps={{ variant: 'subtitle2' }}
                      action={
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Add />}
                          onClick={() => {
                            /* Handle follow */
                          }}
                        >
                          Follow
                        </Button>
                      }
                      sx={{ p: 1 }}
                    />
                  </Card>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Main content area  */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Box sx={{ mb: 2 }}>
              <PostCreateForm onPost={handlePostCreate} user={auth.user} />
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                aria-label="feed tabs"
              >
                <Tab icon={<Whatshot />} label="For You" />
                <Tab icon={<AccessTime />} label="Recent" />
                <Tab icon={<PeopleOutline />} label="Following" />
              </Tabs>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">
                {tabValue === 0 && 'For You'}
                {tabValue === 1 && 'Recent Posts'}
                {tabValue === 2 && 'Following'}
              </Typography>

              <Button
                startIcon={<Refresh />}
                size="small"
                onClick={loadFeed}
                disabled={feedLoading}
              >
                Refresh
              </Button>
            </Box>

            {loading ? (
              <Stack spacing={2}>
                {[1, 2, 3].map((i) => (
                  <Card key={i} sx={{ mb: 2 }}>
                    <CardHeader
                      avatar={
                        <Skeleton variant="circular" width={40} height={40} />
                      }
                      title={<Skeleton width="60%" />}
                      subheader={<Skeleton width="40%" />}
                    />
                    <CardContent>
                      <Skeleton variant="text" height={80} />
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : posts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No posts to show. Follow more users or create a post!
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {posts.map((post, index) => (
                  <Card key={post._id} sx={{ mb: 2 }}>
                    <CardHeader
                      avatar={
                        <Avatar
                          src={`${API}/api/user/photo/${
                            post.postedBy._id
                          }?${new Date().getTime()}`}
                          onClick={() =>
                            navigate({
                              to: `/profile/$userId`,
                              params: { userId: post.postedBy._id },
                            })
                          }
                          sx={{ cursor: 'pointer' }}
                        >
                          {post.postedBy.name[0]}
                        </Avatar>
                      }
                      title={
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 'medium', cursor: 'pointer' }}
                          onClick={() =>
                            navigate({
                              to: `/profile/$userId`,
                              params: { userId: post.postedBy._id },
                            })
                          }
                        >
                          {post.postedBy.name}
                        </Typography>
                      }
                      subheader={new Date(post.created).toLocaleString()}
                      action={
                        post.postedBy._id === auth.user._id && (
                          <IconButton size="small">
                            <Typography variant="caption">...</Typography>
                          </IconButton>
                        )
                      }
                    />

                    <CardContent sx={{ py: 1 }}>
                      <Typography variant="body1">{post.text}</Typography>

                      {post.photo && (
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                          <img
                            src={`${API}/api/posts/photo/${post._id}`}
                            alt="Post"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '300px',
                              borderRadius: '8px',
                            }}
                          />
                        </Box>
                      )}
                    </CardContent>

                    <Divider />

                    <CardActions disableSpacing>
                      {post.likes.includes(auth.user._id) ? (
                        <IconButton
                          color="primary"
                          onClick={() => handlePostUnlike(post._id, index)}
                        >
                          <Favorite />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => handlePostLike(post._id, index)}
                        >
                          <FavoriteBorder />
                        </IconButton>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {post.likes.length}
                      </Typography>

                      <IconButton sx={{ ml: 1 }}>
                        <Comment />
                      </IconButton>
                      <Typography variant="body2" color="text.secondary">
                        {post.comments ? post.comments.length : 0}
                      </Typography>

                      <IconButton sx={{ ml: 1 }}>
                        <Share />
                      </IconButton>
                    </CardActions>
                  </Card>
                ))}
              </Stack>
            )}

            {feedLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={30} />
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right sidebar */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Trending
            </Typography>

            <Stack spacing={1.5}>
              {[
                { tag: '#innovation', posts: 1243 },
                { tag: '#technology', posts: 982 },
                { tag: '#design', posts: 754 },
                { tag: '#programming', posts: 621 },
                { tag: '#webdev', posts: 543 },
              ].map((trend) => (
                <Box
                  key={trend.tag}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {trend.tag}
                  </Typography>
                  <Chip
                    label={`${trend.posts} posts`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              ))}
            </Stack>
          </Paper>

          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Upcoming Events
            </Typography>

            <Stack spacing={2}>
              {[
                { title: 'Tech Summit 2025', date: 'Apr 15, 2025' },
                { title: 'Developer Conference', date: 'May 22, 2025' },
                { title: 'Design Workshop', date: 'Jun 10, 2025' },
              ].map((event) => (
                <Card key={event.title} variant="outlined">
                  <CardContent sx={{ py: 1.5 }}>
                    <Typography variant="subtitle2">{event.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {event.date}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

// Component for creating new posts
const PostCreateForm = ({ onPost, user }) => {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!text.trim()) return

    try {
      setSubmitting(true)
      await onPost(text)
      setText('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Avatar
          src={
            user._id
              ? `${API}/api/user/photo/${user._id}?${new Date().getTime()}`
              : null
          }
          alt={user.name}
        >
          {user.name[0]}
        </Avatar>

        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="outlined"
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!text.trim() || submitting}
        >
          {submitting ? <CircularProgress size={24} /> : 'Post'}
        </Button>
      </Box>
    </Box>
  )
}

export default Home
