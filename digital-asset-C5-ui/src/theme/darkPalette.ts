import {PaletteOptions} from "@mui/material";
import {teal} from "@mui/material/colors";

export const darkPalette: PaletteOptions = {
  mode: "dark",
  background: { default: "#0A131F", paper: "#0A131F" },
  primary: {
    main: "#969fab",
    light: "#c0c5cc",
    dark: "#101f32",
  },
  secondary: {
    main: teal[500],
    light: teal[200],
    dark: teal[800],
  },
};
