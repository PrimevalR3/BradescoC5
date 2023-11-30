import {Box, Button, Stack} from "@mui/material";
import {
  AppBar,
  AppBarIconWrapper,
  AppBarThemeSwitcher,
  AppBarTitle,
  LogoR3Light,
} from "@r3-ui-test/ui-organism-library";

import UserMenuButton from "../UserMenuButton/UserMenuButton";

function BrandedHeader() {
  return (
    <AppBar>
      <AppBarIconWrapper>
        <LogoR3Light />
      </AppBarIconWrapper>
      <AppBarTitle>Digital Asset C5</AppBarTitle>
      <Box sx={{ flexGrow: 1 }} />
      <Stack
        direction="row"
        spacing={{ sm: 1, md: 2 }}
        justifyContent="center"
        alignItems="center"
        className="hidden sm:flex"
      >
        <Button
          href="https://www.r3.com/contact"
          target="_blank"
          variant="text"
          color="inherit"
          disableElevation
        >
          Contact us
        </Button>
        <UserMenuButton />
        <AppBarThemeSwitcher />
      </Stack>
    </AppBar>
  );
}

export default BrandedHeader;
