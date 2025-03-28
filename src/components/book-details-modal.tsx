"use client"

import { CheckCircle2, Calendar, Clock, Star, NotebookPen, BookOpen, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Book } from "@prisma/client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface BookDetailsDialogProps {
    book: Book | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function BookDetailsDialog({ book, open, onOpenChange }: BookDetailsDialogProps) {
    if (!book) return null

    const renderRating = () => {
        if (!book.rating) return null

        return (
            <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-5 w-5 ${i < book.rating! ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                    />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                    ({book.rating}/5)
                </span>
            </div>
        )
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex-row items-center justify-between">
                    <DialogTitle className="text-2xl">Detalhes do Livro</DialogTitle>
                </DialogHeader>

                <div className="flex md:grid-cols-3 gap-8 pt-4">
                    <div className="relative aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                            src={book.image || "/placeholder-book.png"}
                            alt={`Capa do livro ${book.title}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 300px"
                        />
                        <Badge className="absolute top-2 right-2 bg-green-500">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Lido
                        </Badge>
                    </div>
                    <div className="md:col-span-2">
                        <h1 className="text-2xl font-bold">{book.title}</h1>
                        <p className="text-lg text-muted-foreground">{book.author}</p>
                        <div className="mt-6 space-y-4">
                            <div className="flex items-start">
                                <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Data de leitura</p>
                                    <p>
                                        {book.endDate ?
                                            new Date(book.endDate).toLocaleDateString("pt-BR", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric"
                                            }) :
                                            "Não informada"}
                                    </p>
                                </div>
                            </div>

                            {book.startDate && (
                                <div className="flex items-start">
                                    <Clock className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Tempo de leitura</p>
                                        <p>
                                            {book.daysToRead} dia{book.daysToRead !== 1 ? "s" : ""}
                                            {book.startDate && (
                                                <span className="text-sm text-muted-foreground ml-2">
                                                    (de {new Date(book.startDate).toLocaleDateString("pt-BR")})
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start">
                                <BookOpen className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Progresso</p>
                                    <p>Completo ({book.pages} páginas)</p>
                                </div>
                            </div>

                            {book.rating && (
                                <div className="flex items-start">
                                    <Star className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Sua avaliação</p>
                                        {renderRating()}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
                {book.notes && (
                    <div className="mt-8">
                        <div className="flex items-center mb-2">
                            <NotebookPen className="h-5 w-5 mr-2 text-gray-500" />
                            <h3 className="font-medium">Suas anotações</h3>
                        </div>
                        <p className="text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded-md">
                            {book.notes}
                        </p>
                    </div>
                )}
                {book.description && (
                    <div className="mt-8">
                        <h3 className="font-medium mb-2">Sinopse</h3>
                        <p className="text-gray-700">{book.description}</p>
                    </div>
                )}

                <div className="flex justify-end pt-6">
                    <Button onClick={() => onOpenChange(false)}>
                        Fechar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}