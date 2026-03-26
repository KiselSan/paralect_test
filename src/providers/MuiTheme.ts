'use client'

import { createTheme, Theme } from "@mui/material/styles"

const mainTheme: Theme = createTheme({
  palette: {
    secondary: {
      light: '#e8ebed',
      main: '#bdbaba',
      dark: '#979797'
    }
  },
  spacing: 4,
})

export default mainTheme
