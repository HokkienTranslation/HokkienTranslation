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
      onPrimaryContainer: "#21005D",
      outlineVariant: "#CAC4D0",
      header: "#fbf2fc",
    },
    dark: {
      surface: "#37323D",
      onSurface: "#E6E1E5",
      onSurfaceVariant: "#CAC4D0",
      primaryContainer: "#4A4468",
      onPrimaryContainer: "#EADDFF",
      outlineVariant: "#49454F",
      header: "#646165",
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
