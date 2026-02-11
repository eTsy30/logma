import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/login', '/registration'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!token;
  const { pathname } = request.nextUrl;

  // Редирект с корня
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(isAuthenticated ? '/dashboard' : '/login', request.url),
    );
  }

  // Защищенные маршруты (только для авторизованных)
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Страницы логина/регистрации не для авторизованных
  if (
    authRoutes.some((route) => pathname.startsWith(route)) &&
    isAuthenticated
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/registration', '/'],
};
