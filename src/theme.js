import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
  custom: {
    title: {
      fontWeight: 400,
      fontSize: "1.2rem",
      lineHeight: 1.5,
      letterSpacing: "0.00938em",
      textTransform: "capitalize",
    },
  },
});

export default theme;
