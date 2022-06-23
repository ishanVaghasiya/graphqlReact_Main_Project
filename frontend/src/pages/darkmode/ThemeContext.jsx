import React, { createContext, useState } from 'react'

const ThemeContext = createContext();
const ThemeProvider = ({ children }) => {

  const [darkmode, setDarkmode] = useState(JSON.parse(localStorage.getItem("darkmode")));
  return (
    <>
      <ThemeContext.Provider value={{ darkmode, setDarkmode }}>
        {children}
      </ThemeContext.Provider>
    </>
  )
}

export { ThemeContext, ThemeProvider }
