import { NextRequest, NextResponse } from 'next/server';

// ─── Firebase REST API Configuration ─────────────────────────────────────────
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// Base URL for Firestore REST API
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function firestoreRestFetch(path: string, method: string = 'GET', body?: any) {
    const url = `${FIRESTORE_BASE_URL}/${path}?key=${API_KEY}`;
    const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (body) {
        options.body = JSON.stringify(body);
    }

    const res = await fetch(url, options);
    if (!res.ok) {
        throw new Error(`Firestore REST Error: ${res.statusText}`);
    }

    // Some responses (like an empty COMMIT) might not have JSON
    const text = await res.text();
    return text ? JSON.parse(text) : {};
}

// Helper to determine if a document exists by making a targeted GET request
async function getDocument(path: string) {
    try {
        const data = await firestoreRestFetch(path);
        return data; // Document exists
    } catch (e: any) {
        if (e.message.includes('Not Found')) return null;
        throw e;
    }
}

// ─── Track Events (POST) ────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action } = body;

        // ── Increment Component Stat ──
        if (action === 'track_component') {
            const { componentId, field } = body;

            if (!componentId || !['views', 'copies', 'snack_opens', 'studio_uses'].includes(field)) {
                return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
            }

            const docPath = `component_stats/${componentId}`;

            await firestoreRestFetch(':commit', 'POST', {
                writes: [
                    {
                        transform: {
                            document: `projects/${PROJECT_ID}/databases/(default)/documents/${docPath}`,
                            fieldTransforms: [
                                {
                                    fieldPath: field,
                                    increment: { integerValue: "1" }
                                }
                            ]
                        }
                    }
                ]
            });

            return NextResponse.json({ success: true });
        }

        // ── Increment Global Counter ──
        if (action === 'increment_global') {
            const { field, referrer } = body;

            const allowedFields = [
                'total_views', 'total_copies', 'total_snack_opens',
                'total_studio_landing_views', 'total_studio_builder_views',
                'total_studio_exports', 'total_studio_copies',
                'total_studio_props_updates', 'total_studio_code_views',
                'total_visitors'
            ];

            if (!allowedFields.includes(field)) {
                return NextResponse.json({ error: 'Invalid field' }, { status: 400 });
            }

            const fieldTransforms: any[] = [
                {
                    fieldPath: field,
                    increment: { integerValue: "1" }
                }
            ];

            // If this is a visitor increment, also categorize the traffic source
            if (field === 'total_visitors') {
                let channel = 'visit_direct';
                if (referrer) {
                    const ref = referrer.toLowerCase();
                    if (ref.includes('google.') || ref.includes('bing.') || ref.includes('yahoo.') || ref.includes('duckduckgo.')) {
                        channel = 'visit_search';
                    } else if (ref.includes('t.co') || ref.includes('twitter.com') || ref.includes('x.com') || ref.includes('facebook.com') || ref.includes('fb.com') || ref.includes('linkedin.com') || ref.includes('reddit.com') || ref.includes('instagram.com')) {
                        channel = 'visit_social';
                    } else if (ref.includes(request.nextUrl.host)) {
                        channel = 'visit_direct'; // Internal or same-site
                    } else {
                        channel = 'visit_referral';
                    }
                }

                fieldTransforms.push({
                    fieldPath: channel,
                    increment: { integerValue: "1" }
                });
            }

            await firestoreRestFetch(':commit', 'POST', {
                writes: [
                    {
                        transform: {
                            document: `projects/${PROJECT_ID}/databases/(default)/documents/counters/global`,
                            fieldTransforms
                        }
                    }
                ]
            });

            return NextResponse.json({ success: true });
        }

        // ── Increment Dev Count ──
        if (action === 'increment_dev') {
            await firestoreRestFetch(':commit', 'POST', {
                writes: [
                    {
                        transform: {
                            document: `projects/${PROJECT_ID}/databases/(default)/documents/counters/global`,
                            fieldTransforms: [
                                {
                                    fieldPath: "dev_count",
                                    increment: { integerValue: "1" }
                                }
                            ]
                        }
                    }
                ]
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('[Track API] Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// ─── Helper to unwrap Firestore REST API response format ─────────────────────
function unwrapFirestoreData(fields: any) {
    if (!fields) return {};
    const result: any = {};
    for (const [key, value] of Object.entries(fields)) {
        const rawValue = value as any;
        if (rawValue.integerValue !== undefined) result[key] = parseInt(rawValue.integerValue, 10);
        else if (rawValue.stringValue !== undefined) result[key] = rawValue.stringValue;
        else if (rawValue.booleanValue !== undefined) result[key] = rawValue.booleanValue;
        else if (rawValue.doubleValue !== undefined) result[key] = parseFloat(rawValue.doubleValue);
        else result[key] = rawValue;
    }
    return result;
}

// ─── Get Stats (GET) ─────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
    try {
        const type = request.nextUrl.searchParams.get('type');

        // Dev count — PUBLIC (for the home page counter)
        if (type === 'dev_count') {
            const doc = await getDocument('counters/global');
            if (doc && doc.fields) {
                const data = unwrapFirestoreData(doc.fields);
                return NextResponse.json({ dev_count: data.dev_count || 175 });
            }
            return NextResponse.json({ dev_count: 175 });
        }

        // Trending Components — PUBLIC (for the component grid)
        if (type === 'trending') {
            try {
                const res = await firestoreRestFetch('component_stats');
                if (res.documents && Array.isArray(res.documents)) {
                    const stats = res.documents.map((doc: any) => {
                        const id = doc.name.split('/').pop();
                        const data = unwrapFirestoreData(doc.fields);
                        // Popularity Score: (Views * 1) + (Copies * 6) + (Studio Uses * 4) + (Snack Opens * 2)
                        const score = (data.views || 0) +
                            ((data.copies || 0) * 6) +
                            ((data.studio_uses || 0) * 4) +
                            ((data.snack_opens || 0) * 2);
                        return { id, score };
                    });

                    // Sort by score and take top 4
                    const trending = stats
                        .sort((a: any, b: any) => b.score - a.score)
                        .slice(0, 4)
                        .map((s: any) => s.id);

                    return NextResponse.json({ trending });
                }
                return NextResponse.json({ trending: [] });
            } catch (e) {
                console.error('[Trending API] Error:', e);
                return NextResponse.json({ trending: [] });
            }
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
            const doc = await getDocument('counters/global');
            if (doc && doc.fields) {
                const data = unwrapFirestoreData(doc.fields);
                return NextResponse.json(data);
            }
            return NextResponse.json({
                dev_count: 175,
                total_views: 0,
                total_copies: 0,
                total_snack_opens: 0,
                total_studio_landing_views: 0,
                total_studio_builder_views: 0,
                total_studio_exports: 0,
                total_studio_copies: 0,
                total_studio_props_updates: 0,
                total_studio_code_views: 0,
                total_visitors: 0,
            });
        }

        // ── Component Stats (admin only) ──
        if (type === 'components') {
            // Need to retrieve all documents in a collection via REST GET
            const res = await firestoreRestFetch('component_stats');
            const stats: Record<string, any> = {};
            if (res.documents && Array.isArray(res.documents)) {
                for (const doc of res.documents) {
                    // document.name looks like: projects/.../databases/(default)/documents/component_stats/buttons
                    const id = doc.name.split('/').pop();
                    stats[id] = unwrapFirestoreData(doc.fields);
                }
            }
            return NextResponse.json(stats);
        }

        return NextResponse.json({ error: 'Invalid type param' }, { status: 400 });
    } catch (error) {
        console.error('[Track API] GET Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
