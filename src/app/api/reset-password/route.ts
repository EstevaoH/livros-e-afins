import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    const { token, newPassword } = await request.json();

    try {
        // Verifica se o token é válido
        const user = await db.user.findFirst({
            where: { resetToken: token },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Token inválido ou expirado." },
                { status: 400 }
            );
        }

        // Criptografa a nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Atualiza a senha do usuário e remove o token de redefinição
        await db.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
            },
        });

        return NextResponse.json(
            { success: true, message: "Senha redefinida com sucesso!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao redefinir a senha:", error);
        return NextResponse.json(
            { success: false, message: "Erro interno do servidor." },
            { status: 500 }
        );
    }
}