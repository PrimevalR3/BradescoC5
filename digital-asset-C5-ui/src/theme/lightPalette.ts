import {PaletteOptions} from "@mui/material";
import {grey, teal} from "@mui/material/colors";

export const lightPalette: PaletteOptions = {
  mode: "light",
  background: { default: grey[100], paper: "#fff" },
  primary: {
    main: "#2d4058",
    light: "#1d3659",
    dark: "#101f32",
  },
  secondary: {
    main: teal[500],
    light: teal[200],
    dark: teal[800],
  },
};
