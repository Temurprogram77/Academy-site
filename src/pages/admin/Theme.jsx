import { createContext, useContext, useState, useEffect } from "react";

// Context yaratish
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // darkMode o‘zgarganda body rangini o‘zgartirish
  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = "#171717";
      document.body.style.color = "white";
    } else {
      document.body.style.backgroundColor = "#f9fafb"; // oq rejim
      document.body.style.color = "black";
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// custom hook
export const useTheme = () => useContext(ThemeContext);
