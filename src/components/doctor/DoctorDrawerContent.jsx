import React from "react";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useLocation } from "react-router-dom";
import DoctorUserHeader from "./DoctorUserHeader";
import { useThemeContext } from "../../services/theme_context";

const DoctorDrawerContent = ({ userInfo, menuItems, handleLogout, setMobileOpen, t }) => {
  const location = useLocation();
  const { colors } = useThemeContext();
  const themeColors = colors;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: themeColors.box,
        color: themeColors.secondary,
        fontFamily: themeColors.fontFamily,
      }}
    >
      <DoctorUserHeader
        userInfo={userInfo}
        t={t}
        onMenuClick={() => setMobileOpen((p) => !p)}
      />

      <Divider sx={{ my: 1, borderColor: themeColors.listItemNormalText }} />

      <List
        sx={{
          flexGrow: 1,
          "& .MuiListItemIcon-root": {
            color: themeColors.secondary,
            minWidth: 34,
          },
        }}
      >
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                component={Link}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                sx={{
                  my: 0.75,
                  py: 0.75,
                  borderRadius: 2,
                  mx: 1,
                  gap: 0.5,
                  minHeight: 45,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? themeColors.text : themeColors.secondary,
                  backgroundColor: isActive ? themeColors.chosen : themeColors.box,
                  "&:hover": {
                    backgroundColor: themeColors.chosen,
                    color: themeColors.text,
                  },
                  transition: "0.15s background",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? themeColors.text : themeColors.secondary,
                    minWidth: 34,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={t(item.key)} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: themeColors.border, mt: 2 }} />

      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{ my: 1, mx: 1, minHeight: 30, borderRadius: 1.5 }}
          >
            <ListItemIcon sx={{ color: "#b31313", minWidth: 28 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary={t("logout")}
              sx={{ color: "#b31313", m: 0 }}
              primaryTypographyProps={{ fontSize: 16, fontWeight: 400 }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default DoctorDrawerContent;
