"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, BookOpen, BookMarked } from "lucide-react"
import { Book } from "@prisma/client"
import BookList from "./book-list"
import { ReadingStatus } from "@/types/book"
import StartReadingModal from "@/components/start-reading-modal"
import { toast } from "sonner"

export default function BookLibrary() {
    const [activeTab, setActiveTab] = useState<string>("read")
    const [selectedBook, setSelectedBook] = useState<Book | null>(null)
    const [libraryBooks, setLibraryBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isStartReadingModalOpen, setIsStartReadingModalOpen] = useState(false)

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch("/api/books", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Erro ao buscar os livros.");
                }

                const data = await response.json();
                console.log(data)
                setLibraryBooks(data.books);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);
    const readCount = libraryBooks.filter((book: Book) => book.status === "read").length
    const readingCount = libraryBooks.filter((book: Book) => book.status === "reading").length
    const toReadCount = libraryBooks.filter((book: Book) => book.status === "to-read").length

    const handleStartReading = (book: Book) => {
        setSelectedBook(book)
        setIsStartReadingModalOpen(true)
    }

    const handleConfirmStartReading = async (bookId: string, startDate: Date, currentPage: number, totalPages: number) => {
        const progress = Math.round((currentPage / totalPages) * 100);

        try {
            const updatedBooks = libraryBooks.map((book: Book) => {
                if (book.id === bookId) {
                    return {
                        ...book,
                        status: "reading" as ReadingStatus,
                        startDate: startDate,
                        currentPages: currentPage,
                        pages: totalPages,
                        progress,
                    };
                }
                return book;
            });

            setLibraryBooks(updatedBooks);

            const response = await fetch(`/api/books?id=${bookId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: "reading",
                    startDate: startDate.toISOString().split("T")[0],
                    currentPages: currentPage,
                    pages: totalPages,
                    progress,
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao atualizar o livro.");
            }
            setIsStartReadingModalOpen(false);
            toast("Leitura iniciada!", { description: `Você começou a ler ${selectedBook?.title}. Boa leitura!` })
            setActiveTab("reading");
        } catch (error) {
            console.error("Erro ao iniciar a leitura:", error);
            toast("Erro",
                {
                    description: "Ocorreu um erro ao iniciar a leitura. Tente novamente.",
                });
        }
    };

    return (
        <div>
            <Tabs defaultValue="read" onValueChange={(value: any) => setActiveTab(value)}>
                <TabsList className="grid w-full grid-cols-3 mb-8 gap-7">
                    <TabsTrigger value="read" className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Lidos ({readCount})</span>
                    </TabsTrigger>
                    <TabsTrigger value="reading" className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>Lendo ({readingCount})</span>
                    </TabsTrigger>
                    <TabsTrigger value="to-read" className="flex items-center gap-1">
                        <BookMarked className="h-4 w-4" />
                        <span>Quero ler ({toReadCount})</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="read">
                    <BookList
                        books={libraryBooks.filter((book: Book) => book.status === "read")}
                        status="read"
                        onStartReading={handleStartReading}
                    />
                </TabsContent>

                <TabsContent value="reading">
                    <BookList
                        books={libraryBooks.filter((book: Book) => book.status === "reading")}
                        status="reading"
                        onStartReading={handleStartReading}
                    />
                </TabsContent>

                <TabsContent value="to-read">
                    <BookList
                        books={libraryBooks.filter((book: Book) => book.status === "to-read")}
                        status="to-read"
                        onStartReading={handleStartReading}
                    />
                </TabsContent>
            </Tabs>
            <StartReadingModal
                book={selectedBook}
                isOpen={isStartReadingModalOpen}
                onClose={() => setIsStartReadingModalOpen(false)}
                onConfirm={handleConfirmStartReading}
            />
        </div>
    )
}

