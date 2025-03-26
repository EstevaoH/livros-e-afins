"use client"

import { useEffect, useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, BookOpen, BookMarked } from "lucide-react"
import { Book } from "@prisma/client"
import BookList from "./book-list"
import { ReadingStatus } from "@/types/book"
import StartReadingModal from "@/components/start-reading-modal"
import { toast } from "sonner"
import { LoadingSpinner } from "@/components/loadingSpinner"
import { BookDetailsDialog } from "@/components/book-details-modal"

export default function BookLibrary() {
    const [activeTab, setActiveTab] = useState<ReadingStatus>("read")
    const [selectedBook, setSelectedBook] = useState<Book | null>(null)
    const [libraryBooks, setLibraryBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isStartReadingModalOpen, setIsStartReadingModalOpen] = useState(false)
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

    const bookCounts = useMemo(() => ({
        read: libraryBooks.filter(book => book.status === "read").length,
        reading: libraryBooks.filter(book => book.status === "reading").length,
        toRead: libraryBooks.filter(book => book.status === "to-read").length
    }), [libraryBooks])

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true)
            try {
                const response = await fetch("/api/books")
                if (!response.ok) throw new Error("Erro ao buscar os livros")
                const data = await response.json()
                setLibraryBooks(data.books)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro desconhecido")
                toast.error("Erro ao carregar livros")
            } finally {
                setLoading(false)
            }
        }

        fetchBooks()
    }, [])

    const handleStartReading = (book: Book) => {
        setSelectedBook(book)
        setIsStartReadingModalOpen(true)
    }

    const handleShowDetails = (book: Book) => {
        setSelectedBook(book)
        setIsDetailsDialogOpen(true)
    }

    const handleConfirmStartReading = async (bookId: string, startDate: Date, currentPage: number, totalPages: number) => {
        const progress = Math.round((currentPage / totalPages) * 100)

        try {
            const response = await fetch(`/api/books?id=${bookId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "reading",
                    startDate: startDate.toISOString(),
                    currentPages: currentPage,
                    pages: totalPages,
                    progress
                })
            })

            if (!response.ok) throw new Error("Erro ao atualizar o livro")

            setLibraryBooks(prev => prev.map(book => 
                book.id === bookId ? {
                    ...book,
                    status: "reading",
                    startDate,
                    currentPages: currentPage,
                    pages: totalPages,
                    progress
                } : book
            ))

            setIsStartReadingModalOpen(false)
            toast.success("Leitura iniciada!", {
                description: `Você começou a ler ${selectedBook?.title}. Boa leitura!`
            })
            setActiveTab("reading")
        } catch (err) {
            toast.error("Erro ao iniciar leitura")
        }
    }

    if (loading) return <LoadingSpinner />
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>

    return (
        <div className="container mx-auto px-4 py-8">
            <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
                <TabsList className="grid w-full grid-cols-3 mb-8 gap-2 md:gap-4">
                    <TabsTrigger value="read" className="flex items-center gap-1 md:gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Lidos ({bookCounts.read})</span>
                    </TabsTrigger>
                    <TabsTrigger value="reading" className="flex items-center gap-1 md:gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>Lendo ({bookCounts.reading})</span>
                    </TabsTrigger>
                    <TabsTrigger value="to-read" className="flex items-center gap-1 md:gap-2">
                        <BookMarked className="h-4 w-4" />
                        <span>Quero ler ({bookCounts.toRead})</span>
                    </TabsTrigger>
                </TabsList>

                {(["read", "reading", "to-read"] as ReadingStatus[]).map(status => (
                    <TabsContent key={status} value={status}>
                        <BookList
                            books={libraryBooks.filter(book => book.status === status)}
                            status={status}
                            onStartReading={handleStartReading}
                            onDetailsBook={handleShowDetails}
                        />
                    </TabsContent>
                ))}
            </Tabs>

            <StartReadingModal
                book={selectedBook}
                isOpen={isStartReadingModalOpen}
                onClose={() => setIsStartReadingModalOpen(false)}
                onConfirm={handleConfirmStartReading}
            />

            <BookDetailsDialog
                book={selectedBook}
                open={isDetailsDialogOpen}
                onOpenChange={setIsDetailsDialogOpen}
            />
        </div>
    )
}