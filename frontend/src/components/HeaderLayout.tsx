// Mostly LLM Generated: Claude Sonnet 5.5 Medium
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import type { ReactElement } from "react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Explore", to: "/explore" },
  { label: "Login", to: "/login" },
];

const HeaderLayout = (): ReactElement => (
  <>
    <Box component="header" sx={{ py: 4, textAlign: "center" }}>
      <Typography variant="h1" component="h1" sx={{ fontWeight: 800 }}>
        CEECer
      </Typography>
      <Typography variant="subtitle1">Seek and thou shalt find</Typography>
    </Box>

    <AppBar position="sticky" component="nav" color="default" elevation={1}>
      <Toolbar variant="dense">
        {navItems.map((item) => (
          <Button
            key={item.to}
            component={NavLink}
            to={item.to}
            end={item.to === "/"}
            color="inherit"
            sx={{ "&.active": { fontWeight: 700, borderBottom: 2 } }}
          >
            {item.label}
          </Button>
        ))}
      </Toolbar>
    </AppBar>

    <Box component="main" sx={{ p: 1 }}>
      <Outlet />
    </Box>
  </>
);

export default HeaderLayout;
