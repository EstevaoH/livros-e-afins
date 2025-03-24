import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id || typeof id !== 'string') {
        return NextResponse.json({ message: 'ID do usuário inválido.' }, { status: 400 });
    }

    try {
        const user = await db.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                name: true,
                lastName: true,
                email: true,
            },
        });

        if (!user) {
            return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('Erro na API:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || typeof id !== 'string') {
        return NextResponse.json({ message: 'ID do usuário inválido.' }, { status: 400 });
    }

    try {
        // Extrai os dados do corpo da requisição
        const body = await req.json();
        const { name, lastName, username, email } = body;

        // Atualiza o usuário no banco de dados
        const updatedUser = await db.user.update({
            where: { id: id },
            data: {
                name: name,
                lastName: lastName,
                username: username,
                email: email,
            },
        });

        if (!updatedUser) {
            return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
        }

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error('Erro na API:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}