import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth";
export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json(
            { success: false, message: "Não autorizado." },
            { status: 401 }
        );
    }
    try {
        const {
            title,
            author,
            description,
            publishedDate,
            isbn,
            priority,
            rating,
            image,
            genre,
            pages,
            language,
            publisher,
            status,
            startReadingDate,
            endReadingDate,
            notes,
            currentPages,
        } = await request.json();
        if (!title || !author || !isbn) {
            return NextResponse.json(
                { success: false, message: "Campos obrigatórios faltando." },
                { status: 400 }
            );
        }
        const parsedStartDate = startReadingDate ? new Date(startReadingDate) : null;
        const parsedEndDate = endReadingDate ? new Date(endReadingDate) : null;
        let daysToRead = null;

        if (parsedStartDate && parsedEndDate) {
            const timeDiff = parsedEndDate.getTime() - parsedStartDate.getTime();
            if (timeDiff >= 0) {
                daysToRead = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            } else {
                daysToRead = null;
                return NextResponse.json(
                    { success: false, message: "A data de término não pode ser anterior à data de início." },
                    { status: 500 }
                );
            }
        }
        let progressCurrent = null
        if (currentPages) {
            const progress = Math.round((currentPages / pages) * 100);
            if (progress >= 0) {
                progressCurrent = progress

            } else {
                progressCurrent = null
                return NextResponse.json(
                    { success: false, message: "O progresso não pode ser  abaixo de 0" },
                    { status: 500 }
                );
            }
        }
        let currentPage = null
        if (status === 'read') {
            progressCurrent = 100;
            currentPage = pages
        } else {
            currentPage = currentPages
        }
        const book = await db.book.create({
            data: {
                title,
                author,
                description,
                publishedDate: new Date(publishedDate),
                isbn,
                userId: session?.user.id!,
                priority,
                rating,
                image,
                genre,
                pages,
                language,
                publisher,
                status,
                startDate: parsedStartDate,
                endDate: parsedEndDate,
                notes,
                daysToRead,
                currentPages: currentPage,
                progress: progressCurrent
            },
        });

        return NextResponse.json(
            { success: true, message: "Livro cadastrado com sucesso.", book },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao cadastrar o livro:", error);
        return NextResponse.json(
            { success: false, message: "Erro interno do servidor." },
            { status: 500 }
        );
    }
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json(
            { success: false, message: "Não autorizado." },
            { status: 401 }
        );
    }

    try {
        const books = await db.book.findMany({
            where: {
                userId: session.user.id,
            },
        });

        return NextResponse.json(
            { success: true, books },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao buscar os livros:", error);
        return NextResponse.json(
            { success: false, message: "Erro interno do servidor." },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!session?.user) {
        return NextResponse.json(
            { success: false, message: "Não autorizado." },
            { status: 401 }
        );
    }
    const { status, startDate, currentPages, pages, progress } = await request.json();

    try {

        if (!status || !startDate || !pages) {
            const updatedBook = await db.book.update({
                where: { id: id! },
                data: {
                    currentPages,
                    progress,
                },
            });
            return NextResponse.json(
                { success: true, message: "Livro cadastrado com sucesso.", updatedBook },
                { status: 201 }
            );
        }

        const updatedBook = await db.book.update({
            where: { id: id! },
            data: {
                status,
                startDate: new Date(startDate),
                currentPages,
                pages,
                progress,
            },
        });

        return NextResponse.json(
            { success: true, message: "Livro cadastrado com sucesso.", updatedBook },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Erro ao atualizar o livro." },
            { status: 500 }
        );
    }

}