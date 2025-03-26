import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Stack,
  Divider,
} from '@mui/material'
import { ErrorOutline, Home, ArrowBack } from '@mui/icons-material'

const Page404 = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate({ to: -1 })
  }

  return (
    <Container
      maxWidth="md"
      sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          py: 6,
          px: 4,
          borderRadius: 2,
          textAlign: 'center',
          backgroundColor: 'background.paper',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <ErrorOutline color="error" sx={{ fontSize: 80, mb: 2 }} />

          <Typography
            variant="h1"
            color="error"
            sx={{
              fontSize: { xs: '3rem', md: '4rem' },
              fontWeight: 'bold',
              letterSpacing: 2,
            }}
          >
            404
          </Typography>

          <Typography
            variant="h4"
            color="text.primary"
            sx={{
              fontWeight: 'medium',
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            Page introuvable
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: '500px', mb: 2 }}
          >
            La page que vous recherchez n'existe pas ou a été déplacée. Vérifiez
            l'URL ou revenez à la page d'accueil.
          </Typography>

          <Divider sx={{ width: '100%', my: 2 }} />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleGoBack}
              sx={{ px: 3 }}
            >
              Retour
            </Button>

            <Link to="/">
              <Button variant="contained" startIcon={<Home />} sx={{ px: 3 }}>
                Accueil
              </Button>
            </Link>
          </Stack>
        </Box>
      </Paper>
    </Container>
  )
}

export default Page404
