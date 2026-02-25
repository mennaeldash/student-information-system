// src/components/assistant/TADrawerContent.jsx
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
import { useTranslation } from "react-i18next";
import TAUserHeader from "./TAUserHeader";
import { useThemeContext } from "../../services/theme_context.jsx";

const MENU_WIDTH = 300;
const ITEM_GAP = 8;
const ITEM_HEIGHT = 44;

const TADrawerContent = ({
  userInfo,
  menuItems,
  handleLogout,
  setMobileOpen,
  t,
}) => {
  const location = useLocation();
  const { colors } = useThemeContext();
  const themeColors = colors;

  const { i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || i18n.language || "").toLowerCase();
  const isRTL = lang.startsWith("ar");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: MENU_WIDTH,
        backgroundColor: themeColors.box,
        color: themeColors.secondary,
        fontFamily: themeColors.fontFamily,
        px: 1,
      }}
    >
      <TAUserHeader
        userInfo={userInfo}
        t={t}
        onMenuClick={() => setMobileOpen?.((p) => !p)}
      />

      <Divider sx={{ my: 1, borderColor: themeColors.listItemNormalText }} />

      {/* scrollable menu items */}
      <Box sx={{ flex: 1, overflowY: "auto", pr: 0.5 }}>
        <List
          disablePadding
          sx={{
            py: 1,
            display: "flex",
            flexDirection: "column",
            gap: `${ITEM_GAP}px`,
            "& .MuiListItemIcon-root": {
              color: themeColors.secondary,
              minWidth: 34,
            },
          }}
        >
          {menuItems.map((item) => {
            const toPath = item.to?.startsWith("/") ? item.to : `/${item.to}`;
            const isActive =
              location.pathname === toPath ||
              location.pathname.startsWith(`${toPath}/`);

            const isStudentsDir = item.to === "/ta/StudentsDirectory";

            return (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.to}
                  state={isStudentsDir ? { reset: true } : undefined}
                  onClick={() => {
                    setMobileOpen?.(false);
                    if (isStudentsDir) {
                      sessionStorage.removeItem("selectedStudent");
                    }
                  }}
                  selected={isActive}
                  sx={{
                    py: isActive ? 0.5 : 0.75,
                    px: isActive ? 2.2 : 2.7,
                    minHeight: ITEM_HEIGHT,
                    borderRadius: 1,
                    transition: "background-color .15s, color .15s",
                    fontSize: "16px",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    backgroundColor: isActive ? themeColors.chosen : "transparent",
                    "&.Mui-selected": {
                      backgroundColor: themeColors.chosen,
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: themeColors.chosen,
                    },
                    "&:hover": {
                      backgroundColor: themeColors.chosen,
                    },
                    "& .MuiListItemText-root": {
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? themeColors.text : themeColors.secondary,
                      minWidth: 34,
                      width: 30,
                      mr: isRTL ? 0 : 1.25,
                      ml: isRTL ? 1.25 : 0,
                      "& svg": { width: 20, height: 20, fontSize: 20 },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={t(item.key)}
                    primaryTypographyProps={{
                      fontSize: 16,
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box sx={{ mt: "auto" }} />
      <Divider sx={{ borderColor: themeColors.border, mt: 1 }} />

      {/* logout button */}
      <Box sx={{ pb: 1.5, pt: 1 }}>
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 36,
                borderRadius: 1.5,
                px: 1,
                justifyContent: isRTL ? "flex-end" : "flex-start",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#b31313",
                  minWidth: 28,
                  mr: isRTL ? 0 : 1,
                  ml: isRTL ? 1 : 0,
                }}
              >
                <LogoutIcon />
              </ListItemIcon>

              <ListItemText
                primary={t("logout")}
                sx={{ m: 0, textAlign: isRTL ? "right" : "left" }}
                primaryTypographyProps={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#b31313",
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default TADrawerContent;
