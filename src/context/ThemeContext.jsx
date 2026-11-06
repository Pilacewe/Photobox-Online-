import React, { createContext, useState, useContext } from 'react';

// Membuat Context
const ThemeContext = createContext();

// Provider untuk membungkus aplikasi
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // Default Dark Mode

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook kustom untuk mempermudah pemanggilan
export const useTheme = () => useContext(ThemeContext);