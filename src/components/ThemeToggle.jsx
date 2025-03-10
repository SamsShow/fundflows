import { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-400 transition-colors"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        <FiMoon className="w-5 h-5 text-neutral-500 dark:text-neutral-100" />
      ) : (
        <FiSun className="w-5 h-5 text-neutral-500 dark:text-neutral-100" />
      )}
    </button>
  );
};

export default ThemeToggle;
