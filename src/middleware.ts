import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  let cookie = request.cookies.get('refreshSession')?.value || ''

  if (!cookie) {
    return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
  }
}

export const config = {
  matcher: [
    '/'
  ]
}