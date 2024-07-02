import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const themes = {
    light: {
      surface: "#FEF7FF",
      onSurface: "#1D1B20",
      onSurfaceVariant: "#49454F",
      primaryContainer: "#EADDFF",
      darkerPrimaryContainer: "#D7C7F0",
      evenDarkerPrimaryContainer: "#A191BA",
      onPrimaryContainer: "#21005D",
      outlineVariant: "#CAC4D0",
      header: "#FBF2FC",
      buttonBorder: "#cbc5d4",
      highlightButtonBorder: "#635d6b",
    },
    dark: {
      surface: "#37323D",
      onSurface: "#E6E1E5",
      onSurfaceVariant: "#CAC4D0",
      primaryContainer: "#444a68",
      darkerPrimaryContainer: "#3B415E",
      evenDarkerPrimaryContainer: "#2C3147",
      onPrimaryContainer: "#EADDFF",
      outlineVariant: "#49454F",
      header: "#646165",
      buttonBorder: "#666a7d",
      highlightButtonBorder: "#989db3",
    },
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
