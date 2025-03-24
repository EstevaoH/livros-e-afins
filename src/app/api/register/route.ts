import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { sign } from "jsonwebtoken";

export async function POST(request: Request) {
    const { username, name, lastName, email, password } = await request.json();

    // Validação básica dos dados
    if (!username || !email || !password) {
        return NextResponse.json(
            { success: false, message: "Todos os campos são obrigatórios." },
            { status: 400 }
        );
    }

    try {
        // Verifica se o usuário já existe
        const existingUser = await db.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return NextResponse.json(
                    { success: false, message: "Este e-mail já foi cadastrado." },
                    { status: 400 }
                );
            } else if (existingUser.username === username) {
                return NextResponse.json(
                    { success: false, message: "Este nome de usuário já está em uso." },
                    { status: 400 }
                );
            }
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o usuário no banco de dados
        const user = await db.user.create({
            data: {
                username,
                name,
                lastName,
                email,
                password: hashedPassword,
            },
        });

        // Gera tokens de acesso e atualização
        console.log(process.env.AUTH_SECRET)
        const accessToken = sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.AUTH_SECRET!, // Usa a variável de ambiente corretamente
            { expiresIn: "1h" } // Token de acesso expira em 1 hora
        );

        const refreshToken = sign(
            { id: user.id },
            process.env.AUTH_SECRET!, // Usa a variável de ambiente corretamente
            { expiresIn: "7d" } // Token de atualização expira em 7 dias
        );

        // Armazena o token de atualização no banco de dados
        await db.token.create({
            data: {
                token: refreshToken,
                type: "refresh",
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
                userId: user.id,
            },
        });

        // Retorna os tokens e informações do usuário
        return NextResponse.json(
            {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    name: user.name,
                    lastName: user.lastName,
                },
                accessToken,
                refreshToken,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao registrar:", error);
        return NextResponse.json(
            { success: false, message: "Erro interno do servidor." },
            { status: 500 }
        );
    }
}