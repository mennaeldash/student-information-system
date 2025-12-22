// src/components/ThemeToggle.jsx

import { WbSunny, NightlightRound } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

export default function ThemeToggle({ currentTheme, setCurrentTheme }) {
  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);

    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {currentTheme === "dark" ? <WbSunny  /> : <NightlightRound  />}
    </IconButton>
  );
}