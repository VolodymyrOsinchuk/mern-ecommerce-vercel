import React, { useState, useEffect } from 'react'
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material'
import { ArrowForward, Person, Search, Refresh } from '@mui/icons-material'
import {
  useNavigate,
  useLoaderData,
  Form,
  useActionData,
  useNavigation,
  useSubmit,
} from 'react-router-dom'
import { list, searchUsers } from '../user/api-user'

// Fonction loader pour récupérer les données au chargement de la route
export const loader = async ({ request }) => {
  const url = new URL(request.url)
  const searchTerm = url.searchParams.get('q') || ''

  const abortController = new AbortController()
  const signal = abortController.signal

  try {
    let data
    if (searchTerm) {
      data = await searchUsers(searchTerm, signal)
    } else {
      data = await list(signal)
    }

    return { users: data || [], searchTerm }
  } catch (error) {
    return { users: [], searchTerm, error: error.message }
  }
}

// Fonction action pour traiter les soumissions de formulaire
export const action = async ({ request }) => {
  const formData = await request.formData()
  const { searchType, userId } = Object.fromEntries(formData)

  try {
    if (searchType === 'filter') {
      // Redirection gérée par le useSubmit plus bas
      return null
    }

    if (searchType === 'deleteUser' && userId) {
      // Exemple de suppression d'utilisateur (à implémenter selon votre API)
      // await deleteUser(userId);
      return { success: true, message: 'Utilisateur supprimé avec succès' }
    }

    return null
  } catch (error) {
    return { error: error.message || 'Une erreur est survenue' }
  }
}

const Users = () => {
  const { users, searchTerm, error: loaderError } = useLoaderData()
  const actionData = useActionData()
  const navigation = useNavigation()
  const navigate = useNavigate()
  const submit = useSubmit()

  const isLoading = navigation.state === 'loading'

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`)
  }

  const handleSearchChange = (e) => {
    const isFirstSearch = searchTerm === ''
    submit(e.currentTarget.form, {
      replace: !isFirstSearch,
    })
  }

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        margin: { xs: 2, sm: 5 },
        maxWidth: 800,
        mx: 'auto',
      }}
    >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{
          color: 'primary.main',
          fontWeight: 'medium',
          mb: 3,
        }}
      >
        Utilisateurs
      </Typography>

      {/* Formulaire de recherche */}
      <Form id="search-form" role="search">
        <Box sx={{ display: 'flex', mb: 3, gap: 1 }}>
          <TextField
            name="q"
            defaultValue={searchTerm}
            placeholder="Rechercher des utilisateurs..."
            fullWidth
            size="small"
            variant="outlined"
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <Search color="action" sx={{ mr: 1 }} />,
            }}
          />
          <input type="hidden" name="searchType" value="filter" />
          <Button variant="contained" type="submit" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Rechercher'}
          </Button>
          {searchTerm && (
            <Button variant="outlined" onClick={() => navigate('.')}>
              <Refresh />
            </Button>
          )}
        </Box>
      </Form>

      {/* Messages d'erreur ou de succès */}
      {loaderError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loaderError}
        </Alert>
      )}

      {actionData?.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {actionData.error}
        </Alert>
      )}

      {actionData?.success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {actionData.message}
        </Alert>
      )}

      {/* Liste des utilisateurs */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <List>
            {users.length > 0 ? (
              users.map((user, i) => (
                <ListItem
                  button
                  key={i}
                  onClick={() => handleUserClick(user._id)}
                  divider={i < users.length - 1}
                  sx={{
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={user.avatar}>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={user.name} secondary={user.email} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleUserClick(user._id)}
                    >
                      <ArrowForward />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="textSecondary">
                  {searchTerm
                    ? 'Aucun utilisateur ne correspond à la recherche'
                    : 'Aucun utilisateur disponible'}
                </Typography>
              </Box>
            )}
          </List>

          {/* Information sur le nombre d'utilisateurs */}
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Typography variant="body2" color="textSecondary">
              {users.length} utilisateur{users.length !== 1 ? 's' : ''} trouvé
              {users.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  )
}

export default Users
