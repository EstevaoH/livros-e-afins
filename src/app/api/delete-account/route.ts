import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { password } = await request.json();

    try {
        const user = await db.user.findUnique({
            where: { id: id || "" },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Usuário não encontrado." },
                { status: 404 }
            );
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { success: false, message: "Senha incorreta." },
                { status: 400 }
            );
        }
        await db.user.delete({
            where: { id: user.id },
        });

        return NextResponse.json(
            { success: true, message: "Conta desativada com sucesso." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao desativar a conta:", error);
        return NextResponse.json(
            { success: false, message: "Erro interno do servidor." },
            { status: 500 }
        );
    }
}