import Link from "next/link";
import { Mail, Phone, Linkedin, Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-neutral-950 border-t dark:border-neutral-800 mt-8 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <Link href="mailto:estevaohenril@gmail.com" className="text-sm hover:underline">
                                estevaohenril@gmail.com
                            </Link>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <Link href="tel:+5584998505404" className="text-sm hover:underline">
                                +55 (84) 99850-5404
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="https://www.linkedin.com/in/estevao-ferreira-dev/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50"
                        >
                            <Linkedin className="h-5 w-5" />
                        </Link>
                        <Link
                            href="https://github.com/estevaoh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50"
                        >
                            <Github className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
                <div className="text-center sm:text-left mt-4 text-sm text-gray-600 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Estevão Ferreira. Todos os direitos reservados.
                </div>
            </div>
        </footer>
    );
}