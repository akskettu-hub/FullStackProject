import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#5b3fa6" },
    secondary: { main: "#2a7f86" },
  },
  typography: {
    fontFamily: '"EB Garamond Variable", serif',
    h1: { fontSize: "2rem", fontWeight: 600 },
    h2: { fontSize: "1.5rem", fontWeight: 600 },
    h3: { fontSize: "1.25rem", fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiAccordion: {
      defaultProps: {
        slotProps: { transition: { timeout: 150, unmountOnExit: true } },
      },
    },
    MuiCard: {
      defaultProps: { variant: "outlined" },
      styleOverrides: { root: ({ theme }) => ({ padding: theme.spacing(4) }) },
    },
  },
});
