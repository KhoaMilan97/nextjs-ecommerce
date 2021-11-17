import React, { useContext, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MoreIcon from "@material-ui/icons/MoreVert";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import PostAddIcon from "@material-ui/icons/PostAdd";
import ListAltIcon from "@material-ui/icons/ListAlt";

import Link from "../Link";
import { DataContext } from "../../store/GlobalState";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  link: {
    color: "rgba(0,0,0,0.87)",
  },
  avatar: {
    width: 24,
    height: 24,
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const { state, dispatch } = useContext(DataContext);
  const { auth, cart } = state;
  const router = useRouter();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSignOut = () => {
    Cookies.remove("refreshtoken", { path: "api/auth/accessToken" });
    localStorage.removeItem("firstLogin");
    dispatch({ type: "AUTH", payload: {} });
    dispatch({ type: "NOTIFY", payload: {} });

    return router.push("/");
  };

  const adminNav = () => {
    const adminMenuItem = [
      { title: "Users", icons: <AssignmentIndIcon />, linkTo: "/users" },
      { title: "Products", icons: <PostAddIcon />, linkTo: "/create" },
      { title: "Categories", icons: <ListAltIcon />, linkTo: "/categories" },
    ];
    return adminMenuItem.map((item, i) => (
      <MenuItem
        className={classes.link}
        component={Link}
        href={item.linkTo}
        key={i}
        onClick={handleMenuClose}
      >
        <IconButton color="inherit">{item.icons}</IconButton>
        <p> {item.title}</p>
      </MenuItem>
    ));
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        className={classes.link}
        component={Link}
        href="/profile"
        onClick={handleMenuClose}
      >
        <IconButton color="inherit">
          {auth.user?.avatar ? (
            <Avatar
              className={classes.avatar}
              src={auth.user?.avatar}
              title="avatar"
            />
          ) : (
            <AccountCircle />
          )}
        </IconButton>
        <p>{auth.user?.name}</p>
      </MenuItem>
      {auth.user?.role === "admin" && adminNav()}
      <MenuItem
        onClick={() => {
          handleSignOut();
          handleMenuClose();
        }}
      >
        <IconButton color="inherit">
          <ExitToAppIcon />
        </IconButton>
        <p> Sign Out</p>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem
        className={classes.link}
        component={Link}
        href="/cart"
        onClick={handleMobileMenuClose}
      >
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={cart.length} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Cart</p>
      </MenuItem>

      {Object.keys(auth).length === 0 ? (
        <MenuItem
          component={Link}
          href="/signin"
          onClick={handleMobileMenuClose}
          color="inherit"
        >
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          Sign In
        </MenuItem>
      ) : (
        <MenuItem
          component={Link}
          href="/profile"
          className={classes.link}
          onClick={handleMobileMenuClose}
        >
          <IconButton color="inherit">
            {auth.user?.avatar ? (
              <Avatar
                className={classes.avatar}
                src={auth.user?.avatar}
                title="avatar"
              />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
          <p color="inherit">{auth?.user?.name}</p>
        </MenuItem>
      )}
      {auth.user?.role === "admin" && adminNav()}
      {Object.keys(auth).length > 0 && (
        <MenuItem
          onClick={() => {
            handleSignOut();
            handleMobileMenuClose();
          }}
        >
          <IconButton color="inherit">
            <ExitToAppIcon />
          </IconButton>
          <p>Sign Out</p>
        </MenuItem>
      )}
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Container maxWidth="md">
          <Toolbar disableGutters>
            <Typography
              component={Link}
              href="/"
              className={classes.title}
              variant="h6"
              noWrap
              style={{ color: "white" }}
            >
              Milan-Shopping
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </div>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton
                component={Link}
                href="/cart"
                aria-label="show 4 new mails"
                color="inherit"
                style={{ color: "white" }}
              >
                <Badge badgeContent={cart.length} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              {Object.keys(auth).length === 0 ? (
                <MenuItem
                  style={{ color: "white" }}
                  component={Link}
                  href="/signin"
                >
                  Sign In
                </MenuItem>
              ) : (
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  {auth.user?.avatar ? (
                    <Avatar
                      className={classes.avatar}
                      src={auth.user?.avatar}
                      title="avatar"
                    />
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
              )}
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
