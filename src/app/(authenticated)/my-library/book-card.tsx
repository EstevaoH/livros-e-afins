import { Star, Calendar, BookOpen, Clock, CheckCircle2, BookMarked, Flag, NotebookPen } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Book } from "@prisma/client"
import UpdateReadingModal from "@/components/update-reading-modal"
import { useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import { Button } from "@/components/ui/button"

interface BookCardProps {
    book: Book;
    onStartReading: (book: Book) => void;
    onDetailsBook: (book: Book) => void;
}

export default function BookCard({ book, onStartReading, onDetailsBook }: BookCardProps) {
    const [libraryBooks, setLibraryBooks] = useState<Book[]>([]);
    const renderMyRating = () => {
        const stars = []
        const rating = book.rating || 0

        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`h-4 w-4 ${i <= rating ? "text-yellow-500 fill-yellow-500" : "text-muted stroke-muted"}`}
                />,
            )
        }

        return <div className="flex">{stars}</div>
    }
    const getStatusBadge = () => {
        switch (book.status) {
            case "read":
                return <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 z-10">Lido</Badge>
            case "reading":
                return <Badge className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 z-10">Lendo</Badge>
            case "to-read":
                return <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600 z-10">Quero ler</Badge>
            default:
                return null
        }
    }

    const renderStatusContent = () => {
        switch (book.status) {
            case "read":
                return (
                    <>
                        {book.startDate && (
                            <div className="flex items-center mt-3 text-xs text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>Lindo em {new Date(book.endDate!).toLocaleDateString("pt-BR", { dateStyle: "medium" })}</span>
                            </div>
                        )}
                        {book.daysToRead && (
                            <div className="flex items-center mt-3 text-xs text-muted-foreground">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>Concluido em {book.daysToRead} dias</span>
                            </div>
                        )}

                        <div className="mt-3">
                            <p className="text-xs font-medium mb-1">Minha classificação:</p>
                            {renderMyRating()}
                        </div>

                        {book.notes ? (
                            <div className="mt-3">
                                <div className="flex items-center">
                                    <NotebookPen className="h-4 w-4 mr-1" />
                                    <p className="text-xs font-medium mb-1">Minhas anotações:</p>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-3">{book.notes}</p>
                            </div>
                        ) : (
                            <div className="mt-3">
                                <div className="flex items-center">
                                    <NotebookPen className="h-4 w-4 mr-1" />
                                    <p className="text-xs font-medium mb-1">Minhas anotações:</p>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">Sem anotações</p>
                            </div>
                        )


                        }
                    </>
                )
            case "reading":
                return (
                    <>
                        {book.startDate && (
                            <div className="flex items-center mt-3 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>Iniciado em {new Date(book.startDate!).toLocaleDateString("pt-BR", { dateStyle: "medium" })}</span>
                            </div>
                        )}
                        {book.priority && (
                            <div className="flex items-center mt-3 text-xs text-muted-foreground">
                                <Flag className={`h-4 w-4 mr-1
                                    ${book.priority === "alta" ? "text-red-500" : ""}
                                    ${book.priority === "média" ? "text-yellow-500" : ""}
                                    ${book.priority === "baixa" ? "text-green-500" : ""}
                                `} />
                                <span className="capitalize">{book.priority}</span>
                            </div>
                        )}
                        {book.notes ? (
                            <div className="mt-3">
                                <div className="flex items-center">
                                    <NotebookPen className="h-4 w-4 mr-1" />
                                    <p className="text-xs font-medium mb-1">Minhas anotações:</p>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">{book.notes}</p>
                            </div>
                        ) : (
                            <div className="mt-3">
                                <div className="flex items-center">
                                    <NotebookPen className="h-4 w-4 mr-1" />
                                    <p className="text-xs font-medium mb-1">Minhas anotações:</p>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">Sem anotações</p>
                            </div>
                        )
                        }
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-xs font-medium">Progresso:</p>
                                <span className="text-xs text-muted-foreground">{book.progress}%</span>
                            </div>
                            <Progress value={book.progress} className="h-2" />
                            {book.currentPages && book.pages && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Pagina {book.currentPages} de {book.pages}
                                </p>
                            )}
                        </div>
                    </>
                )
            case "to-read":
                return (
                    <>
                        {book.priority && (
                            <div className="flex items-center mt-3 text-xs text-muted-foreground">
                                <Flag className={`h-4 w-4 mr-1
                                    ${book.priority === "alta" ? "text-red-500" : ""}
                                    ${book.priority === "média" ? "text-yellow-500" : ""}
                                    ${book.priority === "baixa" ? "text-green-500" : ""}
                                `} />
                                <span className="capitalize">{book.priority}</span>
                            </div>
                        )}
                        <div className="mt-3">
                            <p className="text-xs font-medium mb-1">Minha classificação:</p>
                            {renderMyRating()}
                        </div>

                        {book.notes ? (
                            <div className="mt-3">
                                <div className="flex items-center">
                                    <NotebookPen className="h-4 w-4 mr-1" />
                                    <p className="text-xs font-medium mb-1">Minhas anotações:</p>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">{book.notes}</p>
                            </div>
                        ) : (
                            <div className="mt-3">
                                <div className="flex items-center">
                                    <NotebookPen className="h-4 w-4 mr-1" />
                                    <p className="text-xs font-medium mb-1">Minhas anotações:</p>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">Sem anotações</p>
                            </div>
                        )
                        }
                    </>
                )
            default:
                return null
        }
    }

    const getActionButton = () => {
        switch (book.status) {
            case "read":
                return <Button onClick={() => onDetailsBook(book)} type="submit" variant={"outline"} className="w-full">Ver detalhes</Button>
            case "reading":
                return <UpdateReadingModal book={book} onUpdateProgress={handleUpdateProgress} />
            case "to-read":
                return <Button onClick={() => onStartReading(book)} type="submit" variant={"outline"} className="w-full"> Começar a ler </Button>
            default:
                return null
        }
    }
    const getStatusIcon = () => {
        switch (book.status) {
            case "read":
                return <CheckCircle2 className="h-4 w-4 text-green-500" />
            case "reading":
                return <BookOpen className="h-4 w-4 text-blue-500" />
            case "to-read":
                return <BookMarked className="h-4 w-4 text-amber-500" />
            default:
                return null
        }
    }

    const handleUpdateProgress = async (currentPage: number) => {
        try {
            const progress = Math.round((currentPage / book.pages!) * 100);
            const updatedBooks = libraryBooks.map((b) => {
                if (b.id === book.id) {
                    return {
                        ...b,
                        currentPages: currentPage,
                        progress,
                    };
                }
                return b;
            });

            setLibraryBooks(updatedBooks);

            const response = await axios.put(`/api/books/progress?id=${book.id}`, {
                currentPages: currentPage,
                progress,
            });

            if (response.status === 201) {
                toast("Progresso atualizado!", {
                    description: `Você está na página ${currentPage} de ${book.pages}.`,
                });
                if (progress === 100) {
                    toast("Parabéns!", {
                        description: "Você terminou de ler o livro! Deseja finalizar a leitura?",
                        action: (
                            <Button
                                variant="default"
                                onClick={() => handleFinishReading(book.id)}
                            >
                                Finalizar leitura
                            </Button>
                        ),
                    });
                }
            } else {
                throw new Error("Erro ao atualizar o progresso.");
            }
        } catch (error) {
            console.error("Erro ao atualizar o progresso:", error);
            toast("Erro", {
                description: "Ocorreu um erro ao atualizar o progresso. Tente novamente.",
            });
        }
    };

    const handleFinishReading = async (bookId: string) => {
        try {
            const response = await axios.put(`/api/books/progress?id=${bookId}`, {
                status: "read",
                endDate: new Date(),
                startDate: book.startDate,
                progress: book.progress,
                currcurrentPages: book.pages
            });

            if (response.status === 201) {
                const updatedBooks = libraryBooks.map((b) => {
                    if (b.id === bookId) {
                        return {
                            ...b,
                            status: "read",
                            endDate: new Date(),
                        };
                    }
                    return b;
                });

                setLibraryBooks(updatedBooks);

                toast("Leitura finalizada!2", {
                    description: "O livro foi marcado como lido.",
                });
            } else {
                throw new Error("Erro ao finalizar a leitura.");
            }
        } catch (error) {
            console.error("Erro ao finalizar a leitura:", error);
            toast("Erro", {
                description: "Ocorreu um erro ao finalizar a leitura. Tente novamente.",
            });
        }
    };

    return (
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full py-0 ">
            <div className="aspect-[2/3] relative overflow-hidden bg-muted">
                {getStatusBadge()}
                <Image
                    src={book.image || "/placeholder.svg"}
                    alt={`Cover of ${book.title}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                />
            </div>

            <CardContent className="p-4 flex-grow">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold text-lg line-clamp-1">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                    <div>{getStatusIcon()}</div>
                </div>

                {renderStatusContent()}

                <div className="flex gap-2 flex-wrap mt-4">
                    {Array.isArray(book.genre) && book.genre.map((genre, index) => (
                        <span
                            key={index}
                            className="text-xs px-2 py-1 bg-secondary rounded-md"
                        >
                            {genre?.toString()}
                        </span>
                    ))}

                </div>
            </CardContent>

            <CardFooter className="p-4 grid gap-2 items-start border-t mt-auto">
                {
                    book.status === "reading" && book.progress === 100 && (
                        <Button type="submit" variant={"outline"} className="w-full cursor-pointer"> Finalizar leitura </Button>
                    )
                }
                {getActionButton()}
            </CardFooter>
        </Card>
    )
}

