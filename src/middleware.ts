import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get("auth")?.value === "true";
  const isLoginPage = request.nextUrl.pathname === "/login";

  // Se não autenticado e não está na página de login, redireciona
  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se autenticado e está na página de login, redireciona para home
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Aplica o middleware em todas as rotas, exceto arquivos estáticos
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};