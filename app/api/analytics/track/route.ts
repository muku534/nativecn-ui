import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment,
    collection,
    getDocs,
} from 'firebase/firestore';

// ─── Firebase Init (server-side, re-uses same config) ────────────────────────

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Use a separate app name to avoid conflicts with client-side app
const SERVER_APP_NAME = 'server-analytics';

function getServerDb() {
    let app;
    try {
        app = getApp(SERVER_APP_NAME);
    } catch {
        app = initializeApp(firebaseConfig, SERVER_APP_NAME);
    }
    return getFirestore(app);
}

const COUNTERS_COLLECTION = 'counters';
const COMPONENT_STATS_COLLECTION = 'component_stats';

// ─── Track Events (POST) ────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action } = body;
        const db = getServerDb();

        // ── Increment Component Stat ──
        if (action === 'track_component') {
            const { componentId, field } = body;

            if (!componentId || !['views', 'copies', 'snack_opens'].includes(field)) {
                return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
            }

            const ref = doc(db, COMPONENT_STATS_COLLECTION, componentId);
            const snap = await getDoc(ref);

            if (snap.exists()) {
                await updateDoc(ref, { [field]: increment(1) });
            } else {
                await setDoc(ref, { views: 0, copies: 0, snack_opens: 0, [field]: 1 });
            }

            return NextResponse.json({ success: true });
        }

        // ── Increment Global Counter ──
        if (action === 'increment_global') {
            const { field } = body;

            if (!['total_views', 'total_copies', 'total_snack_opens'].includes(field)) {
                return NextResponse.json({ error: 'Invalid field' }, { status: 400 });
            }

            const ref = doc(db, COUNTERS_COLLECTION, 'global');
            const snap = await getDoc(ref);

            if (snap.exists()) {
                await updateDoc(ref, { [field]: increment(1) });
            } else {
                await setDoc(ref, {
                    dev_count: 175,
                    total_views: 0,
                    total_copies: 0,
                    total_snack_opens: 0,
                    [field]: 1,
                });
            }

            return NextResponse.json({ success: true });
        }

        // ── Increment Dev Count ──
        if (action === 'increment_dev') {
            const ref = doc(db, COUNTERS_COLLECTION, 'global');
            const snap = await getDoc(ref);

            if (snap.exists()) {
                await updateDoc(ref, { dev_count: increment(1) });
            } else {
                await setDoc(ref, { dev_count: 175 });
            }

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('[Track API] Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// ─── Get Stats (GET) ─────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
    try {
        const db = getServerDb();
        const type = request.nextUrl.searchParams.get('type');

        // Dev count — PUBLIC (for the home page counter)
        if (type === 'dev_count') {
            const ref = doc(db, COUNTERS_COLLECTION, 'global');
            const snap = await getDoc(ref);

            if (snap.exists()) {
                return NextResponse.json({ dev_count: snap.data()?.dev_count || 175 });
            }
            return NextResponse.json({ dev_count: 175 });
        }

        // Everything below requires admin session ────────────────────
        const sessionCookie = request.cookies.get('nativecn_admin_session');
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify session with auth API
        const authUrl = new URL('/api/analytics/auth', request.url);
        const authRes = await fetch(authUrl.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `nativecn_admin_session=${sessionCookie.value}`,
            },
            body: JSON.stringify({ action: 'verify' }),
        });

        if (!authRes.ok) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // ── Global Counters (admin only) ──
        if (type === 'global') {
            const ref = doc(db, COUNTERS_COLLECTION, 'global');
            const snap = await getDoc(ref);

            if (snap.exists()) {
                return NextResponse.json(snap.data());
            }
            return NextResponse.json({
                dev_count: 175,
                total_views: 0,
                total_copies: 0,
                total_snack_opens: 0,
            });
        }

        // ── Component Stats (admin only) ──
        if (type === 'components') {
            const snap = await getDocs(collection(db, COMPONENT_STATS_COLLECTION));
            const stats: Record<string, any> = {};
            snap.forEach((d) => {
                stats[d.id] = d.data();
            });
            return NextResponse.json(stats);
        }

        return NextResponse.json({ error: 'Invalid type param' }, { status: 400 });
    } catch (error) {
        console.error('[Track API] GET Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
