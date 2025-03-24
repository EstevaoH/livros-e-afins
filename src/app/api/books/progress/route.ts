import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../../auth";

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
    const { currentPages, progress, endDate, startDate, status } = await request.json();
    try {
        const parsedStartDate = startDate ? new Date(startDate) : null;
        const parsedEndDate = endDate ? new Date(endDate) : null;
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
        if (endDate) {
            const updatedBook = await db.book.update({
                where: { id: id! },
                data: {
                    endDate,
                    daysToRead,
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
        return NextResponse.json(
            { success: false, message: "Erro ao atualizar o livro." },
            { status: 500 }
        );
    }

}