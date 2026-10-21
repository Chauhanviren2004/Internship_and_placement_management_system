import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./AppRoutes/AppRoutes";
import NotificationListener from "./NotificationListener";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <>
      <Toaster />
      <NotificationListener />
      <button 
        onClick={toggleTheme}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
          padding: "10px 15px",
          borderRadius: "50%",
          backgroundColor: "var(--accent, #0dcaf0)",
          color: "var(--bg-primary, #1f2230)",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
          fontSize: "20px"
        }}
        title="Toggle Theme"
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
      <AppRoutes />
    </>
  );
}

export default App;
