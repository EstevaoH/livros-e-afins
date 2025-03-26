import Footer from "@/components/footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <section className="flex flex-col items-center justify-center py-40">
                {children}
            </section>
            <Footer />
        </>
    )
}