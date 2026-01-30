"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const isDarkMode =
      typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const newIsDark = !isDark;

    if (newIsDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    setIsDark(newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="default"
      className="h-11 w-11 rounded-full p-0"
      onClick={toggleTheme}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
