'use client';

import { ThemeProvider, useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/register";

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            forcedTheme={isAuthPage ? "light" : undefined}
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    );
}