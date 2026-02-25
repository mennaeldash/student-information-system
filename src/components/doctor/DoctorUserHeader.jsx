import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useThemeContext } from "../../services/theme_context";

const DoctorUserHeader = ({ userInfo, t, onMenuClick }) => {
  const { colors } = useThemeContext();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 65,
        px: 2,
        bgcolor: colors?.box,
        fontFamily: colors?.fontFamily || "Arial, sans-serif",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
        <img
          src={
            userInfo.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}`
          }
          alt={userInfo.name}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
            border: `2px solid ${colors?.border || "#eee"}`,
            marginInlineEnd: 11,
          }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            fontWeight="bold"
            fontSize="14px"
            color={colors?.text || "#1e293b"}
            sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            title={userInfo?.name}
          >
            {userInfo.name || t("doctor")}
          </Typography>
          <Typography fontSize="12px" color={colors?.secondary || "#64748B"}>
            {userInfo.id}
          </Typography>
        </Box>
      </Box>

      <IconButton
        onClick={onMenuClick}
        size="small"
        aria-label="toggle drawer"
        sx={{
          display: { xs: "inline-flex", sm: "none" },
          bgcolor: colors?.box,
          "&:hover": { bgcolor: colors?.box },
        }}
      >
        <MenuIcon fontSize="medium" />
      </IconButton>
    </Box>
  );
};

export default DoctorUserHeader;
