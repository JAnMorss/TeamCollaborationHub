import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Props = {
    children: ReactNode
}

type Theme = 'light' | 'dark'

type ThemeContextType = {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export default function ThemeProvider({children}: Props) {
    const [theme, setTheme] = useState<Theme>('light')

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    useEffect(() => {
        const root = document.documentElement
        if (theme === "light"){
            root.classList.add("light")
        } else {
            root.classList.remove("light")
        }
    }, [theme])

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    
    return context;
}