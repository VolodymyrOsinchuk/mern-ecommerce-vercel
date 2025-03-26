import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  Avatar,
  Stack,
  IconButton,
  Divider,
  Typography,
  CircularProgress,
  Chip,
  LinearProgress,
  Collapse,
  Alert,
} from '@mui/material'
import {
  Image,
  EmojiEmotions,
  LocationOn,
  Tag,
  Close,
  Send,
  VideoLibrary,
  Poll,
  Event,
} from '@mui/icons-material'
import { create } from '../post/api-post'
import { isAuthenticated } from '../auth/auth-helper'
import { API } from '../config'

/**
 * Composant pour créer de nouvelles publications
 * @param {Object} props - Propriétés du composant
 * @param {Function} props.onPostCreated - Callback appelé après création réussie d'un post
 * @param {boolean} props.expanded - Si le formulaire doit être affiché en mode étendu
 * @param {string} props.initialText - Texte initial du post
 */
const PostCreateForm = ({
  onPostCreated,
  expanded = false,
  initialText = '',
}) => {
  const [text, setText] = useState(initialText)
  const [isExpanded, setIsExpanded] = useState(expanded)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [media, setMedia] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [location, setLocation] = useState('')
  const [tags, setTags] = useState([])
  const [currentTag, setCurrentTag] = useState('')

  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const auth = isAuthenticated()

  const handleTextareaFocus = () => {
    setIsExpanded(true)
  }

  const handleAddMedia = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.match('image.*') && !file.type.match('video.*')) {
      setError('File type not supported. Please upload an image or video.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setError('File is too large. Maximum size is 10MB.')
      return
    }

    setMedia(file)

    const reader = new FileReader()
    reader.onload = (e) => {
      setMediaPreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveMedia = () => {
    setMedia(null)
    setMediaPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && currentTag && !tags.includes(currentTag)) {
      e.preventDefault()
      if (tags.length >= 5) {
        setError('Maximum 5 tags allowed.')
        return
      }
      setTags([...tags, currentTag])
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const createFormData = () => {
    const formData = new FormData()
    formData.append('text', text)
    if (media) {
      formData.append('photo', media)
    }
    if (location) {
      formData.append('location', location)
    }
    if (tags.length > 0) {
      formData.append('tags', JSON.stringify(tags))
    }
    return formData
  }

  const handleSubmit = async () => {
    if (!text.trim() && !media) {
      setError('Post cannot be empty.')
      return
    }

    try {
      setLoading(true)
      setError('')

      // Simuler une progression de téléchargement
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + 5
        })
      }, 100)

      const formData = createFormData()

      const data = await create({ userId: auth.user._id }, auth.token, formData)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (data.error) {
        setError(data.error)
      } else {
        setText('')
        setMedia(null)
        setMediaPreview(null)
        setLocation('')
        setTags([])
        setCurrentTag('')
        setIsExpanded(false)

        if (onPostCreated) {
          onPostCreated(data)
        }
      }
    } catch (err) {
      setError('Error creating post. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  const clearForm = () => {
    setText('')
    setMedia(null)
    setMediaPreview(null)
    setLocation('')
    setTags([])
    setCurrentTag('')
    setIsExpanded(false)
    setError('')
  }

  if (!auth) {
    navigate({ to: '/login' })
    return null
  }

  return (
    <Card elevation={2} sx={{ mb: 3, borderRadius: 2, overflow: 'visible' }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar
            src={
              auth.user._id
                ? `${API}/api/user/photo/${
                    auth.user._id
                  }?${new Date().getTime()}`
                : null
            }
            alt={auth.user.name}
            sx={{ width: 45, height: 45 }}
          >
            {auth.user.name && auth.user.name[0]}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={isExpanded ? 3 : 1}
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={handleTextareaFocus}
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                },
              }}
              disabled={loading}
            />

            <Collapse in={isExpanded}>
              <Box sx={{ mt: 2 }}>
                {mediaPreview && (
                  <Box
                    sx={{
                      position: 'relative',
                      mt: 2,
                      mb: 2,
                      borderRadius: 2,
                      overflow: 'hidden',
                      maxHeight: '300px',
                      textAlign: 'center',
                    }}
                  >
                    {media.type.startsWith('image/') ? (
                      <img
                        src={mediaPreview}
                        alt="Upload preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '300px',
                          objectFit: 'contain',
                        }}
                      />
                    ) : (
                      <video
                        src={mediaPreview}
                        controls
                        style={{
                          maxWidth: '100%',
                          maxHeight: '300px',
                        }}
                      />
                    )}
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.7)',
                        },
                      }}
                      onClick={handleRemoveMedia}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                )}

                {tags.length > 0 && (
                  <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}
                  >
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag.startsWith('#') ? tag : `#${tag}`}
                        onDelete={() => handleRemoveTag(tag)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}

                {location && (
                  <Chip
                    icon={<LocationOn fontSize="small" />}
                    label={location}
                    onDelete={() => setLocation('')}
                    size="small"
                    color="info"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                )}

                <Collapse in={!!currentTag}>
                  <TextField
                    fullWidth
                    size="small"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleAddTag}
                    placeholder="Type a tag and press Enter"
                    sx={{ my: 2 }}
                    InputProps={{
                      startAdornment: (
                        <Tag fontSize="small" color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                </Collapse>

                <Collapse in={!!error}>
                  <Alert
                    severity="error"
                    onClose={() => setError('')}
                    sx={{ mb: 2 }}
                  >
                    {error}
                  </Alert>
                </Collapse>
              </Box>
            </Collapse>
          </Box>
        </Box>

        {uploadProgress > 0 && (
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            sx={{ mt: 2, borderRadius: 1 }}
          />
        )}

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack direction="row" spacing={1}>
            <input
              accept="image/*,video/*"
              id="post-media-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleAddMedia}
              style={{ display: 'none' }}
            />
            <label htmlFor="post-media-upload">
              <IconButton component="span" color="primary" disabled={loading}>
                <Image />
              </IconButton>
            </label>

            <IconButton
              color="primary"
              onClick={() => setCurrentTag((prev) => (prev ? '' : '#'))}
              disabled={loading}
            >
              <Tag />
            </IconButton>

            <IconButton
              color="primary"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setLocation(
                        `${position.coords.latitude.toFixed(
                          2
                        )}, ${position.coords.longitude.toFixed(2)}`
                      )
                    },
                    () => {
                      setLocation('Location')
                    }
                  )
                } else {
                  setLocation('Location')
                }
              }}
              disabled={loading || !!location}
            >
              <LocationOn />
            </IconButton>

            <IconButton color="primary" disabled={loading}>
              <EmojiEmotions />
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={1}>
            {isExpanded && (
              <Button variant="outlined" onClick={clearForm} disabled={loading}>
                Cancel
              </Button>
            )}

            <Button
              variant="contained"
              endIcon={loading ? <CircularProgress size={16} /> : <Send />}
              onClick={handleSubmit}
              disabled={loading || (!text.trim() && !media)}
            >
              Post
            </Button>
          </Stack>
        </Box>

        {isExpanded && (
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={1} justifyContent="center">
              <Chip
                icon={<VideoLibrary fontSize="small" />}
                label="Video"
                clickable
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<Poll fontSize="small" />}
                label="Poll"
                clickable
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<Event fontSize="small" />}
                label="Event"
                clickable
                variant="outlined"
                size="small"
              />
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default PostCreateForm
