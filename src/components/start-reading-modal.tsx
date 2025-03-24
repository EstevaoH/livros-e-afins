"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, BookOpen } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import Image from "next/image"
import { Book } from "@prisma/client"

interface StartReadingModalProps {
  book: Book | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (bookId: string, startDate: Date, currentPage: number, totalPages: number) => void
}

export default function StartReadingModal({ book, isOpen, onClose, onConfirm }: StartReadingModalProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [currentPage, setCurrentPage] = useState<number>(1)
  // const [totalPages, setTotalPages] = useState<number>(book?.pages || 300)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setStartDate(new Date())
      setCurrentPage(1)
      setError(null)
    }
  }, [isOpen])

  useEffect(() => {
    if (currentPage > book?.pages!) {
      setError("A página atual não pode ser maior que o total de páginas.")
    } else {
      setError(null)
    }
  }, [currentPage, book?.pages])

  const handleConfirm = () => {
    if (!startDate) {
      setError("Selecione uma data de início.")
      return
    }

    if (currentPage > book?.pages!) {
      setError("A página atual não pode ser maior que o total de páginas.")
      return
    }

    onConfirm(book!.id, startDate, currentPage, book?.pages!)
    onClose()
  }

  if (!book) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Comece a ler
          </DialogTitle>
          <DialogDescription>
            Você está prestes a começar a ler este livro. Acompanhe seu progresso à medida que avança!
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 items-start py-4">
          <div className="w-24 h-36 relative flex-shrink-0 overflow-hidden rounded-md bg-muted">
            <Image
              src={book.image || "/placeholder.svg"}
              alt={`Cover of ${book.title}`}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h3 className="font-semibold text-lg">{book.title}</h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>
            <div className="flex items-center mt-2">
              <div className="flex gap-2 flex-wrap">
                {Array.isArray(book.genre) &&
                  book.genre.map((genre, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-secondary rounded-md">
                      {genre?.toString()}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="start-date">Quando você começou a ler?</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="start-date"
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="current-page">Página atual</Label>
              <Input
                id="current-page"
                type="number"
                min={1}
                max={book?.pages!}
                value={currentPage}
                onChange={(e) => setCurrentPage(Number.parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="total-pages">Total de páginas</Label>
              <Input
                id="total-pages"
                type="number"
                min={1}
                value={book.pages!}
                // onChange={(e) => setTotalPages(Number.parseInt(e.target.value) || 1)}
                disabled
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={handleConfirm} disabled={!startDate || !!error}>
            Começar a ler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}