import BookLibrary from "./book-library";

export default function MyLibraryPage() {
    return (
        <div className="min-h-screen p-2">
            <h1 className="text-4xl font-bold mb-2 text-center">Minha jornada de leitura</h1>
            <p className="text-center text-muted-foreground mb-8">Acompanhe seu progresso de leitura e descubra seu próximo livro</p>
            <BookLibrary />
        </div>
    );
}

