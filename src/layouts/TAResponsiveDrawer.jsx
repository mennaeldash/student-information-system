

import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import GlobalStyles from "@mui/material/GlobalStyles";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Language as LanguageIcon,
  NotificationsNone as NotificationsNoneIcon,
  WbSunny,
  NightlightRound,
} from "@mui/icons-material";

import {
  User,
  LayoutDashboard,
  Calendar,
  BookOpen,
  ChartColumn,
  Settings,
  ChartSpline
} from "lucide-react";
import { useTranslation } from "react-i18next";

import TADrawerContent from "../components/assistant/TADrawerContent.jsx";
import { useThemeContext } from "../services/theme_context.jsx";

const DRAWER_WIDTH = 300;

function TAResponsiveDrawer(props) {
  const { window: windowProp } = props;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", id: "", avatar: "" });

  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { mode, setMode, colors } = useThemeContext();

  const lang = (i18n.resolvedLanguage || i18n.language || "").toLowerCase();
  const isRTL = lang.startsWith("ar");

  useEffect(() => {
    setUserInfo({
      name:
        localStorage.getItem("user_name") ||
        (isRTL ? "معيد" : "Teaching Assistant"),
      id: localStorage.getItem("user_id") || "TA-00001",
      avatar: localStorage.getItem("user_avatar") || "",
    });
  }, [isRTL]);

  useEffect(() => {
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
  }, [isRTL]);

  const handleDrawerToggle = () => setMobileOpen((v) => !v);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const toggleDarkMode = () => setMode(mode === "dark" ? "light" : "dark");

  const menuItems = useMemo(
    () => [
      { id: 1, key: "Dashboard", icon: <LayoutDashboard />, to: "/ta/dashboard" },
      { id: 2, key: "Profile", icon: <User />, to: "/ta/profile" },
      {
        id: 3,
        key: "Attendance Tracking",
        icon: <Calendar />,
        to: "/ta/attendance",
      },
      {
        id: 4,
        key: "Courses & Sections",
        icon: <BookOpen />,
        to: "/ta/courses",
      },
      {
        id: 5,
        key: "Grading Support",
        icon: <ChartColumn />,
        to: "/ta/gradingsupport",
      },
      {
        id: 6,
        key: "Students Directory",
        icon: <GroupOutlinedIcon />,
        to: "/ta/StudentsDirectory",
      },
       {
        id: 7,
        key: "Registration Requests",
        icon: <BookOpen />,
        to: "/ta/registrationrequests",
      },
            { id: 9, key: "Evaluation",             icon: <ChartSpline />,          to: "/ta/evaluation" },

      { id: 10, key: "Settings", icon: <Settings />, to: "/ta/setting" },
    ],
    []
  );

  const activeMenuItem = menuItems.find(
    (item) =>
      location.pathname === item.to ||
      location.pathname.startsWith(item.to + "/")
  );
  const pageTitle = activeMenuItem ? t(activeMenuItem.key) : "";

  const container =
    windowProp !== undefined ? () => windowProp().document.body : undefined;

  return (
    <Box
      sx={{
        display: "flex",
        fontFamily: colors?.fontFamily,
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <CssBaseline />

      <GlobalStyles
        styles={{
          html: { overflowX: "hidden" },
          body: { overflowX: "hidden" },
          "#root": { overflowX: "hidden" },
          ".MuiDrawer-paper": {
            borderRight: "none !important",
            borderLeft: "none !important",
            boxShadow: "none !important",
          },
        }}
      />

      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { xs: "100%", sm: `calc(100% - ${DRAWER_WIDTH}px)` },
// ...(i18n.language === "ar"
//               ? { mr: { sm: `${DRAWER_WIDTH}px` } }
//             : { ml: { sm: `${DRAWER_WIDTH}px` } }),
          bgcolor: colors?.box,
          color: colors?.secondary,
          fontFamily: colors?.fontFamily,
          border: `1px solid ${colors?.border}`,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "75px",
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          {/* Title + burger */}
          <Box
            sx={{
              display: "flex",
              gap: 1.25,
              alignItems: "center",
              minWidth: 0,
              // flexDirection: isRTL ? "row-reverse" : "row",
              // flex: 1,
              // justifyContent: isRTL ? "flex-end" : "flex-start",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { xs: "inline-flex", sm: "none" }, mr: 0 }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "20px",
                color: colors?.secondary,
                letterSpacing: ".2px",
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                // textAlign: isRTL ? "right" : "left",
              }}
            >
              {pageTitle}
            </Typography>
          </Box>

          {/* Date + controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: ".8rem",
                color: colors?.secondary,
                display: { xs: "none", sm: "block" },
                maxWidth: { sm: 240, md: 360 },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
          {new Date().toLocaleDateString( i18n.language === "ar" ? "ar-EG" : "en-US", 
            { weekday: "long", year: "numeric", month: "long", day: "numeric" } )}
           </Typography>

            <IconButton
              aria-label="change language"
              onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')}
              size="small"
              sx={{ color: colors?.secondary, mr: 2 }}
            >
              <LanguageIcon />
            </IconButton>

            <IconButton
              aria-label="notifications"
              size="small"
              sx={{ color: colors?.secondary }}
            >
              <NotificationsNoneIcon />
            </IconButton>

            <IconButton
              aria-label="toggle dark mode"
              onClick={toggleDarkMode}
              size="small"
              sx={{ color: colors?.secondary }}
            >
              {mode === "dark" ? <WbSunny /> : <NightlightRound />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor={isRTL ? "right" : "left"}
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
            backgroundColor: colors?.box,
          },
        }}
      >
        <TADrawerContent
          userInfo={userInfo}
          themeColors={colors}
          menuItems={menuItems}
          handleLogout={handleLogout}
          setMobileOpen={setMobileOpen}
          t={t}
        />
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
            backgroundColor: colors?.box,
          },
        }}
        open
      >
        <TADrawerContent
          userInfo={userInfo}
          themeColors={colors}
          menuItems={menuItems}
          handleLogout={handleLogout}
          setMobileOpen={setMobileOpen}
          t={t}
        />
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          minHeight: 0,
          flexGrow: 1,
          width: { xs: "100%", sm: `calc(100% - ${DRAWER_WIDTH}px)` },

          // ...(isRTL
          //   ? { mr: { sm: `${DRAWER_WIDTH}px` } }
          //   : { ml: { sm: `${DRAWER_WIDTH}px` } }),
marginInlineStart:{ sm: `${DRAWER_WIDTH}px` },

          display: "flex",
          flexDirection: "column",
          // alignItems: "stretch",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          height: "calc(100vh - 73px)",
          bgcolor: colors?.background,
          color: colors?.text,
          fontFamily: colors?.fontFamily,
          mt: "73px",
          paddingInline: { xs: "3px", sm: "16px", md: "10px" },
          maxWidth: "none",
          mx: 0,
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

TAResponsiveDrawer.propTypes = { window: PropTypes.func };
export default TAResponsiveDrawer;
