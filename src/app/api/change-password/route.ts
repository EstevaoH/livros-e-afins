import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";

export async function PUT(request: Request) {
    const { currentPassword, newPassword, confirmPassword } = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || typeof id !== 'string') {
        return NextResponse.json({ message: 'ID do usuário inválido.' }, { status: 400 });
    }

    try {
        // Verifica se a nova senha e a confirmação de senha são iguais
        if (newPassword !== confirmPassword) {
            return NextResponse.json(
                { success: false, message: "As senhas não coincidem." },
                { status: 400 }
            );
        }

        const user = await db.user.findUnique({
            where: { id: id },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Usuário não encontrado." },
                { status: 404 }
            );
        }

        // Verifica se a senha atual está correta
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return NextResponse.json(
                { success: false, message: "Senha atual incorreta." },
                { status: 400 }
            );
        }

        // Criptografa a nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Atualiza a senha no banco de dados
        await db.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return NextResponse.json(
            { success: true, message: "Senha alterada com sucesso." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao alterar a senha:", error);
        return NextResponse.json(
            { success: false, message: "Erro interno do servidor." },
            { status: 500 }
        );
    }
}