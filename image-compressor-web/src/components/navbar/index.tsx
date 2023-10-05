"use client";

import { MouseEvent, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import { useTheme } from "next-themes";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const pages = [
  { name: "Users", url: "/users" },
  { name: "Images", url: "/images" },
  { name: "Image Logs", url: "/images/logs" },
];

export function ResponsiveAppBar() {
  const { theme, setTheme } = useTheme();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const isLightMode = theme === "light";

  const handleThemeChange = () => {
    setTheme(isLightMode ? "dark" : "light");
  };

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Image Compressor
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map(({ name, url }) => (
                <Link key={name} href={url}>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{name}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Image Compressor
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map(({ name, url }) => (
              <Link key={name} href={url}>
                <Button sx={{ my: 2, color: "white", display: "block" }}>
                  {name}
                </Button>
              </Link>
            ))}
          </Box>

          <IconButton
            className="w-fit p-2 hover:scale-110 active:scale-100 duration-200 text-white"
            onClick={handleThemeChange}
          >
            {isLightMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
