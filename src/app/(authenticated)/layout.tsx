import Navbar from "@/components/navBar";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { authOptions } from "../../../auth";
import { ThemeProvider } from "@/components/theme-provider";

import '@smastrom/react-rating/style.css'
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/footer";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="min-h-screen  dark:bg-neutral-950" suppressHydrationWarning>
                <Navbar userName={session?.user?.username} id={session.user.id} />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
                <Toaster />
            </div>
            <Footer />
        </ThemeProvider>
    )
}