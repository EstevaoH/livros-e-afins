"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeProps {
    userTheme: string;
}

export function Preferences({ userTheme }: ThemeProps) {
    const { setTheme, theme } = useTheme();
    const [isDarkMode, setIsDarkMode] = useState(userTheme === "dark");

    useEffect(() => {
        setIsDarkMode(theme === "dark");
    }, [theme]);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
            setIsDarkMode(savedTheme === "dark");
        }
    }, [setTheme]);

    const handleThemeToggle = (checked: boolean) => {
        const newTheme = checked ? "dark" : "light";

        localStorage.setItem("theme", newTheme);
        setTheme(newTheme);
        setIsDarkMode(checked);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Preferências</CardTitle>
                <CardDescription>Personalize sua experiência no sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                    <Switch
                        checked={isDarkMode}
                        onCheckedChange={handleThemeToggle}
                    />
                    <span>{isDarkMode ? "Tema escuro" : "Tema claro"}</span>
                </div>
            </CardContent>
        </Card>
    );
}