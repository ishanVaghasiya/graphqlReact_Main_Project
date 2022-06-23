import React, { useContext } from 'react'
import "./darkmode.css"
import { ThemeContext } from './ThemeContext'



const ThemeBtn = () => {
    const { darkmode, setDarkmode } = useContext(ThemeContext)
    const handleThemeBtn = () => {
        setDarkmode(!darkmode)
        localStorage.setItem("darkmode", !darkmode)
    }
    console.log(darkmode)
    return (
        <>
            <button className={`myBtn ${darkmode ? "fa fa-toggle-on" : "fa fa-toggle-off"}`} onClick={handleThemeBtn}></button>
        </>
    )
}

export default ThemeBtn
