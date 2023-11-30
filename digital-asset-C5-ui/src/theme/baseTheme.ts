import {alpha, createTheme} from "@mui/material/styles";

export const baseTheme = createTheme({
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    button: {
      textTransform: "capitalize",
    },
  },
  components: {
    MuiAppBar: {
      defaultProps: { position: "fixed" },
      styleOverrides: {
        root: ({ theme }) => ({
          boxShadow: "none",
          borderBottom: "1px solid",
          borderBottomColor: theme.palette.divider,
          left: 0,
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.primary.main
              : theme.palette.background.default,
        }),
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiDrawer-paper": {
            borderColor: theme.palette.divider,
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.primary.dark
                : theme.palette.background.default,
          },
          "& .MuiListItemButton-root": {
            borderTopLeftRadius: theme.shape.borderRadius,
            borderBottomLeftRadius: theme.shape.borderRadius,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.light, 0.3),
            },
          },
        }),
      },
    },
  },
});
