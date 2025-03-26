import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from '@tanstack/react-router'
import {
  Paper,
  Typography,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  List,
  Avatar,
  Divider,
  IconButton,
  Box,
  Skeleton,
  Alert,
  Snackbar,
} from '@mui/material'
import DeleteUser from './DeleteUser'
import { isAuthenticated } from '../auth/auth-helper'
import FollowProfileButton from './FollowProfileButton'
import ProfileTabs from './ProfileTabs'
import { listByUser } from '../post/api-post'
import { API } from '../config'
import { Person, Edit } from '@mui/icons-material'

const Profile = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [values, setValues] = useState({
    user: { following: [], followers: [] },
    following: false,
  })

  const { userId } = useParams()
  const navigate = useNavigate()
  const auth = isAuthenticated()

  useEffect(() => {
    if (!auth) {
      navigate({ to: '/login' })
      return
    }

    const controller = new AbortController()

    const fetchUserData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API}/api/user/${userId}`, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            navigate({ to: '/404' })
            return
          }
          throw new Error(`Network response was not ok: ${response.statusText}`)
        }

        const userData = await response.json()
        const isFollowing = checkFollow(userData)
        setValues({ user: userData, following: isFollowing })
        await loadPosts(userData._id)
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err.message)
          setError('Failed to load user profile')
          if (err.message === 'Failed to fetch') {
            navigate({ to: '/error' })
          }
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()

    return () => controller.abort()
  }, [userId, navigate, auth])

  const loadPosts = async (userId) => {
    try {
      const data = await listByUser({ userId }, auth.token)
      setPosts(data)
    } catch (err) {
      console.error('Error loading posts:', err)
      setError('Failed to load user posts')
    }
  }

  const removePost = (deletedPost) => {
    setPosts((current) =>
      current.filter((post) => post._id !== deletedPost._id)
    )
  }

  const handleFollowButton = async (callApi) => {
    try {
      const data = await callApi(userId, auth.token)
      setValues({
        user: data,
        following: !values.following,
      })
    } catch (err) {
      setError(err.message || 'Failed to update follow status')
    }
  }

  const checkFollow = (user) => {
    return (
      auth?.user &&
      user.followers.some((follower) => follower._id === auth.user._id)
    )
  }

  if (!auth) {
    return null // Already redirecting in useEffect
  }

  if (loading) {
    return (
      <Paper elevation={3} sx={{ maxWidth: 600, margin: 'auto', p: 3, mt: 5 }}>
        <Skeleton
          variant="text"
          height={50}
          width="60%"
          sx={{ mb: 2, mx: 'auto' }}
        />
        <List dense>
          <ListItem>
            <ListItemAvatar>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <ListItemText
              primary={<Skeleton width="60%" />}
              secondary={<Skeleton width="40%" />}
            />
          </ListItem>
          <Divider sx={{ my: 2 }} />
          <ListItem>
            <Skeleton variant="text" width="100%" height={60} />
          </ListItem>
          <ListItem>
            <Skeleton variant="text" width="40%" />
          </ListItem>
        </List>
        <Box sx={{ mt: 3 }}>
          <Skeleton variant="rectangular" height={200} />
        </Box>
      </Paper>
    )
  }

  const photoUrl = values.user._id
    ? `${API}/api/user/photo/${values.user._id}?${new Date().getTime()}`
    : `${API}/images/photo_profile.png`

  return (
    <>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Paper elevation={3} sx={{ maxWidth: 600, margin: 'auto', p: 3, mt: 5 }}>
        <Typography
          variant="h5"
          align="center"
          sx={{ color: 'primary.main', mb: 2, fontWeight: 'medium' }}
        >
          Profile
        </Typography>
        <List dense>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                src={photoUrl}
                alt={values.user.name}
                sx={{ width: 50, height: 50 }}
              >
                <Person />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                  {values.user.name}
                </Typography>
              }
              secondary={values.user.email}
            />
            {auth.user._id === values.user._id ? (
              <ListItemSecondaryAction>
                <Link
                  to="/profile/edit/$userId"
                  params={{ userId: values.user._id }}
                >
                  <IconButton color="primary" edge="end" aria-label="edit">
                    <Edit />
                  </IconButton>
                </Link>
                <DeleteUser
                  userId={values.user._id}
                  onDeleted={() => navigate({ to: '/' })}
                />
              </ListItemSecondaryAction>
            ) : (
              <FollowProfileButton
                following={values.following}
                onButtonClick={handleFollowButton}
              />
            )}
          </ListItem>
          <Divider sx={{ my: 2 }} />
          <ListItem>
            <ListItemText
              primary={
                <Typography variant="body1">
                  {values.user.about || 'No bio available.'}
                </Typography>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  Joined on{' '}
                  {new Date(values.user.createdAt).toLocaleDateString()}
                </Typography>
              }
            />
          </ListItem>
          <Divider sx={{ my: 2 }} />
        </List>

        <Box sx={{ mt: 3 }}>
          <ProfileTabs
            user={values.user}
            posts={posts}
            removePostUpdate={removePost}
            isOwner={auth.user._id === values.user._id}
          />
        </Box>
      </Paper>
    </>
  )
}

export default Profile
