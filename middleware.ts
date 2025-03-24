import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
// Importe o auth do NextAuth.js

export async function middleware(req: NextRequest) {
  const session = await getServerSession(); // Verifica se o usuário está autenticado
  const { pathname } = req.nextUrl;

  // Rotas públicas que não requerem autenticação
  const publicRoutes = ["/login", "/register", "/about", "/contact"];

  // Se o usuário não estiver autenticado e tentar acessar uma rota protegida
  if (!session && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Se o usuário estiver autenticado e tentar acessar uma rota pública
  if (session && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Permite o acesso à rota
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};