export type ReadingStatus = "read" | "reading" | "to-read"
export type BookPriority = "alta" | "média" | "baixa"
export interface BookRequest {
    title: string;
    author: string;
    description?: string;
    publishedDate: string;
    isbn: string;
    priority?: number;
    rating?: number;
    image?: string;
    genre?: string[]
    pages?: number;
    language?: string;
    publisher?: string;
    status?: ReadingStatus;
}

export interface BookResponse {
    success: boolean;
    message: string;
    book?: BookRequest; // Replace `any` with a proper type for the book
}