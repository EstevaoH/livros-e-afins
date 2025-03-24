import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../../auth";

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    // Verifica se o usuário está autenticado
    if (!session?.user) {
        return NextResponse.json(
            { success: false, message: "Não autorizado." },
            { status: 401 }
        );
    }
    const { currentPages, progress, endDate, status } = await request.json();
    try {

        if (endDate) {
            const updatedBook = await db.book.update({
                where: { id: id! },
                data: {
                    endDate,
                    currentPages,
                    progress,
                    status
                },
            });
            return NextResponse.json(
                { success: true, message: "Livro finalizado com sucesso1.", updatedBook },
                { status: 201 }
            );
        }

        const updatedBook = await db.book.update({
            where: { id: id! },
            data: {
                currentPages,
                progress,
            },
        });
        return NextResponse.json(
            { success: true, message: "Livro atualizado com sucesso.", updatedBook },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao atualizar o livro:", error);
        console.log("Erro ao atualizar o livro:", error);
        return NextResponse.json(
            { success: false, message: "Erro ao atualizar o livro." },
            { status: 500 }
        );
    }

}