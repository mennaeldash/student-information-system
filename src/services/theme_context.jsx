// src/services/theme_context.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

const ThemeContext = createContext();

const fetch_theme_colors = async (mode = "light") => {
  try {
    const response = await fetch("https://your-api-link.com/theme");
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    throw new Error("API response not ok");
  } catch (error) {
    console.warn("⚠️ API not available, using Mock Data:", error.message);

    if (mode === "dark") {
      return {
        mode: "dark",
        background: "#0f172a",
        box: "#010D1A",
        text: "#e2e8f0",
        primary: "#9EC8FF",
        secondary: "#94A3B8",
        border: "#374151", 
        chosen: "#1E293B",
      square:"#1E293B",
      tatab:"#0f172a",
                  tabtn:"#e4ebf1ff",
    cod:"#1E293B",
    label:"#020617",
        min:"#0f172a",
        

       
      
      };
    }
    return {
      mode: "light",
    
      background: "#f8fafc",
      box: "#ffffff",
      text: "#1e293b",
      primary: "#3B82F6",
      secondary: "#64748B",
      border: "#E2E8F0",
      chosen: "#F1F5F9",
            square:"#18181B",
                  tatab:"#F4F4F5",
                  tabtn:"#1F609D",
    talab: "#DBEEFF",
    cod:"#EFEFF0",
        label:"#F5F7FA",
        min:"#F1F5F9",
        


    };
  }
};

export const ThemeProviderContext = ({ children, direction = "ltr" }) => {
  const [mode, setMode] = useState("light");
  const [colors, setColors] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetch_theme_colors(mode);
      setColors(data);
    };
    load();
  }, [mode]);

  if (!colors) return null;

  const theme = createTheme({
    direction,
    palette: {
      mode: colors.mode,
      background: {
        default: colors.background,
        paper: colors.box,
      },
      text: { primary: colors.text },
      primary: { main: colors.primary },
      secondary: { main: colors.secondary },
    },
    typography: {
      fontFamily: "Arial, sans-serif",
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, setMode, theme, colors }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
