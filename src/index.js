import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'
import './index.css'
import 'react-toastify/ReactToastify.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CssBaseline />
      <App />
      <ToastContainer position="top-center" />
    </AuthProvider>
  </StrictMode>
)
