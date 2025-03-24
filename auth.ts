import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import db from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email e senha são obrigatórios.");
          }

          const user = await db.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error("Usuário não encontrado.");
          }

          const isValid = await compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Senha incorreta.");
          }

          const { password, ...userWithoutPassword } = user;

          return {
            id: userWithoutPassword.id.toString(),
            name: userWithoutPassword.name,
            email: userWithoutPassword.email,
            username: userWithoutPassword.username,
          };
        } catch (error) {
          console.error("Erro ao autenticar usuário:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email!;

        const accessToken = sign(
          { id: user.id, username: user.username, email: user.email },
          process.env.AUTH_SECRET!,
          { expiresIn: '1h' }
        );

        const refreshToken = sign(
          { id: user.id },
          process.env.AUTH_SECRET!,
          { expiresIn: '7d' }
        );

        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.AUTH_SECRET,
  },
};
