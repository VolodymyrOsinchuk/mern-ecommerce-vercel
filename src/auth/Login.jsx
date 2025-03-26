import React, { useState } from 'react'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
  Icon,
} from '@mui/material' // Updated imports for MUI v6
import { styled } from '@mui/system' // Use styled for custom styling
import { login } from './api-auth.js'
import { authenticate } from './auth-helper.js'
import { useLocation, Navigate } from 'react-router-dom' // Updated to use hooks

// Styled component for Card
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  textAlign: 'center',
  marginTop: theme.spacing(5),
  paddingBottom: theme.spacing(2),
  backgroundColor: 'lightgrey',
}))

const Login = () => {
  const location = useLocation() // Use useLocation hook
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    redirectToReferrer: false,
  })

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value })
  }

  const clickSubmit = () => {
    const user = {
      email: values.email || undefined,
      password: values.password || undefined,
    }
    login(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        authenticate(data, () => {
          setValues({ ...values, error: '', redirectToReferrer: true })
        })
      }
    })
  }

  const { from } = location.state || {
    from: {
      pathname: '/',
    },
  }

  const { redirectToReferrer } = values
  if (redirectToReferrer) {
    return <Navigate to={from} /> // Updated to use Navigate for redirection
  }

  return (
    <div>
      <StyledCard>
        <CardContent>
          <Typography variant="h6">Login</Typography>
          <form noValidate>
            <TextField
              label="Email"
              margin="normal"
              autoComplete="email"
              value={values.email}
              onChange={handleChange('email')}
              fullWidth // Added to make the text field responsive
              variant="outlined" // Updated variant
            />
            <TextField
              label="Mot de passe"
              type="password"
              autoComplete="current-password"
              margin="normal"
              value={values.password}
              onChange={handleChange('password')}
              fullWidth // Added to make the text field responsive
              variant="outlined" // Updated variant
            />
            {values.error && (
              <Typography component="p" color="error">
                <Icon color="error" style={{ verticalAlign: 'middle' }}>
                  error
                </Icon>
                {values.error}
              </Typography>
            )}
          </form>
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={clickSubmit} // Fixed typo in function name
          >
            S'enregistrer
          </Button>
        </CardActions>
      </StyledCard>
    </div>
  )
}

export default Login
