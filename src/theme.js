import { createTheme } from '@mui/material/styles' // Updated import for MUI v6
import { pink } from '@mui/material/colors' // Updated import for MUI v6

const theme = createTheme({
  typography: {
    // In MUI v6, the `useNextVariants` prop is no longer necessary
    fontFamily: 'Roboto, Arial, sans-serif', // You can specify your default font family here
  },
  palette: {
    primary: {
      light: '#5c67a3',
      main: '#3f4771',
      dark: '#2e355b',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff79b0',
      main: '#ff4081',
      dark: '#c60055',
      contrastText: '#000',
    },
    // Custom colors can be added directly under the palette object.
    openTitle: '#3f4771',
    protectedTitle: pink[400],
    mode: 'light', // Updated from `type` to `mode` for light or dark theme
  },
})

export default theme
