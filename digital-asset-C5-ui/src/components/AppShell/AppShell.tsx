import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {Outlet} from "react-router-dom";

import NavBar from "../Navbar/Navbar";
import BrandedHeader from "../BrandedHeader/BrandedHeader";

export default function AppShell() {
  return (
    <Box className="flex">
      <BrandedHeader />
      <NavBar />
      <Box className="w-full py-10" component="main">
        <Toolbar />
        {/* main content will replace Outlet */}
        <Outlet />
      </Box>
    </Box>
  );
}
