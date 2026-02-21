import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';

// Server-only env vars — NEVER exposed to client
const ADMIN_USERNAME = process.env.ANALYTICS_ADMIN_USERNAME || '';
const ADMIN_PASSWORD = process.env.ANALYTICS_PASSWORD || '';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

const COOKIE_NAME = 'nativecn_admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// In-memory session store
const validSessions = new Map<string, { expiry: number }>();

function cleanExpiredSessions() {
    const now = Date.now();
    for (const [id, session] of validSessions.entries()) {
        if (now > session.expiry) {
            validSessions.delete(id);
        }
    }
}

function createSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
}

// Constant-time string comparison (prevents timing attacks)
function safeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action } = body;

        if (action === 'login') {
            const { username, password } = body;

            if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
                return NextResponse.json(
                    { error: 'Admin credentials not configured on server' },
                    { status: 500 }
                );
            }

            const usernameValid = safeCompare(username || '', ADMIN_USERNAME);
            const passwordValid = safeCompare(password || '', ADMIN_PASSWORD);

            if (!usernameValid || !passwordValid) {
                // Delay to prevent brute force
                await new Promise((r) => setTimeout(r, 1000));
                return NextResponse.json(
                    { error: 'Invalid username or password' },
                    { status: 401 }
                );
            }

            // Create session
            cleanExpiredSessions();
            const sessionId = createSessionId();
            const expiry = Date.now() + SESSION_DURATION;
            validSessions.set(sessionId, { expiry });

            // Set httpOnly cookie — JavaScript CANNOT access this
            const response = NextResponse.json({ success: true });
            response.cookies.set(COOKIE_NAME, sessionId, {
                httpOnly: true,       // JS cannot read this cookie
                secure: process.env.NODE_ENV === 'production', // HTTPS only in production
                sameSite: 'strict',   // Prevents CSRF attacks
                maxAge: SESSION_DURATION / 1000,
                path: '/',
            });

            return response;
        }

        if (action === 'verify') {
            const cookieStore = await cookies();
            const sessionCookie = cookieStore.get(COOKIE_NAME);

            if (!sessionCookie) {
                return NextResponse.json({ valid: false }, { status: 401 });
            }

            cleanExpiredSessions();
            const session = validSessions.get(sessionCookie.value);

            if (!session || Date.now() > session.expiry) {
                validSessions.delete(sessionCookie.value);
                // Clear the expired cookie
                const response = NextResponse.json({ valid: false }, { status: 401 });
                response.cookies.delete(COOKIE_NAME);
                return response;
            }

            return NextResponse.json({ valid: true });
        }

        if (action === 'logout') {
            const cookieStore = await cookies();
            const sessionCookie = cookieStore.get(COOKIE_NAME);

            if (sessionCookie) {
                validSessions.delete(sessionCookie.value);
            }

            const response = NextResponse.json({ success: true });
            response.cookies.delete(COOKIE_NAME);
            return response;
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
