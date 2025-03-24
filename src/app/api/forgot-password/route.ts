import { NextResponse } from "next/server";
import db from "@/lib/db";
import { Resend } from 'resend';
import { EmailTemplate } from "@/components/email-template";
import * as React from 'react';
import crypto from 'crypto'; // Para gerar um token seguro

const resend = new Resend(process.env.RESEND_API_KEY);

// Função para gerar um token de redefinição
function generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: Request) {
    const { email } = await request.json();

    try {
        // Verifica se o usuário existe no banco de dados
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "E-mail não encontrado." },
                { status: 404 }
            );
        }

        // Gera um token de redefinição
        const resetToken = generateResetToken();
        const resetTokenExpiresAt = new Date(Date.now() + 3600000); // Expira em 1 hora

        // Atualiza o usuário com o token de redefinição
        await db.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiresAt,
            },
        });

        // Cria o link de redefinição
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

        // Envia o e-mail de redefinição
        const { error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [user.email],
            subject: 'Redefinição de Senha',
            react: EmailTemplate({ firstName: user.name || 'Usuário', resetLink }) as React.ReactElement,
        });

        if (error) {
            console.error("Erro ao enviar o e-mail:", error);
            return NextResponse.json(
                { success: false, message: "Erro ao enviar o e-mail de redefinição." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Link de recuperação enviado com sucesso!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao enviar o link de recuperação:", error);
        return NextResponse.json(
            { success: false, message: "Erro interno do servidor." },
            { status: 500 }
        );
    }
}