"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BookCard from "./book-card"
import { Book } from "@prisma/client"

interface BookListProps {
  books: Book[]
  status: string
  onStartReading: (book: Book) => void
}

export default function BookList({ books, status,onStartReading }: BookListProps) {
  const [sortBy, setSortBy] = useState<string>(getSortDefault(status))

  function getSortDefault(status: string): string {
    switch (status) {
      case "read":
        return "dateRead"
      case "reading":
        return "progress"
      case "to-read":
        return "addedDate"
      default:
        return "title"
    }
  }
  const sortedBooks = [...books].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "author":
        return a.author.localeCompare(b.author);
      case "addedDate":
        const dateA = new Date(a.createdAt || "").getTime();
        const dateB = new Date(b.createdAt || "").getTime();
        return dateB - dateA;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "dateRead":
        const readDateA = new Date(a.endDate || "").getTime();
        const readDateB = new Date(b.endDate || "").getTime();
        return readDateB - readDateA;
      case "progress":
        return (b.progress || 0) - (a.progress || 0);
      case "startedDate":
        const startedDateA = new Date(a.startDate || "").getTime();
        const startedDateB = new Date(b.startDate || "").getTime();
        return startedDateB - startedDateA;
      default:
        return 0;
    }
  });

  const getSortOptions = () => {
    switch (status) {
      case "read":
        return (
          <>
            <SelectItem value="dateRead">Lido recentemente</SelectItem>
            <SelectItem value="title">Título</SelectItem>
            <SelectItem value="author">Autor</SelectItem>
            <SelectItem value="rating">Classificação</SelectItem>
          </>
        );
      case "reading":
        return (
          <>
            <SelectItem value="progress">Progresso de leitura</SelectItem>
            <SelectItem value="startedDate">Iniciado recentemente</SelectItem>
            <SelectItem value="title">Título</SelectItem>
            <SelectItem value="author">Autor</SelectItem>
          </>
        );
      case "to-read":
        return (
          <>
            <SelectItem value="addedDate">Adicionado recentemente</SelectItem>
            <SelectItem value="title">Título</SelectItem>
            <SelectItem value="author">Autor</SelectItem>
          </>
        );
      default:
        return <SelectItem value="title">Título</SelectItem>;
    }
  };

  const getStatusMessage = () => {
    if (books.length === 0) {
      switch (status) {
        case "read":
          return "Você ainda não marcou nenhum livro como lido."
        case "reading":
          return "Você não está lendo nenhum livro no momento."
        case "to-read":
          return "Você não tem nenhum livro na sua lista de leitura."
        default:
          return "Nenhum livro encontrado."
      }
    }
    return null
  }

  const emptyMessage = getStatusMessage()

  return (
    <div>
      {books.length > 0 ? (
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Ordenar por:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>{getSortOptions()}</SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">{emptyMessage}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedBooks.map((book) => (
          <BookCard key={book.id} book={book} onStartReading={onStartReading} />
        ))}
      </div>
    </div>
  )
}

