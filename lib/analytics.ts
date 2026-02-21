'use client';

import { logEvent } from './firebase';

// ─── Event Names ─────────────────────────────────────────────────────────────

export const EVENTS = {
    COMPONENT_VIEW: 'component_view',
    COMPONENT_CARD_CLICK: 'component_card_click',
    COPY_COMPONENT_CODE: 'copy_component_code',
    COPY_USAGE_EXAMPLE: 'copy_usage_example',
    COPY_COMPONENT_PREVIEW: 'copy_component_preview',
    OPEN_IN_SNACK: 'open_in_snack',
    TAB_SWITCH: 'tab_switch',
    CATEGORY_FILTER: 'category_filter',
    SEARCH_COMPONENT: 'search_component',
} as const;

// ─── Server API Helpers (No direct Firestore access) ─────────────────────────

async function serverTrack(action: string, data: Record<string, any>): Promise<void> {
    try {
        await fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, ...data }),
        });
    } catch {
        // Silent fail — analytics should never break the UI
    }
}

// ─── Event Tracking ──────────────────────────────────────────────────────────

/** Track component view */
export function trackComponentView(componentId: string, componentName: string, category: string) {
    logEvent(EVENTS.COMPONENT_VIEW, {
        component_id: componentId,
        component_name: componentName,
        category,
    });
    serverTrack('track_component', { componentId, field: 'views' });
    serverTrack('increment_global', { field: 'total_views' });
}

/** Track code copy + dev counter for new users */
export function trackCopyCode(
    componentId: string,
    componentName: string,
    section: string,
    language?: string
) {
    logEvent(EVENTS.COPY_COMPONENT_CODE, {
        component_id: componentId,
        component_name: componentName,
        section,
        language: language || 'unknown',
    });
    serverTrack('track_component', { componentId, field: 'copies' });
    serverTrack('increment_global', { field: 'total_copies' });

    // Increment dev count if this is a new user
    if (typeof window !== 'undefined' && !localStorage.getItem('nativecn_is_dev')) {
        localStorage.setItem('nativecn_is_dev', 'true');
        serverTrack('increment_dev', {});
    }
}

/** Track Snack open */
export function trackSnackOpen(componentId: string, componentName: string, snackId: string) {
    logEvent(EVENTS.OPEN_IN_SNACK, {
        component_id: componentId,
        component_name: componentName,
        snack_id: snackId,
    });
    serverTrack('track_component', { componentId, field: 'snack_opens' });
    serverTrack('increment_global', { field: 'total_snack_opens' });
}

/** Track tab switch */
export function trackTabSwitch(componentId: string, fromTab: string, toTab: string) {
    logEvent(EVENTS.TAB_SWITCH, {
        component_id: componentId,
        from_tab: fromTab,
        to_tab: toTab,
    });
}

/** Track component card click */
export function trackCardClick(componentId: string, componentName: string, position: number) {
    logEvent(EVENTS.COMPONENT_CARD_CLICK, {
        component_id: componentId,
        component_name: componentName,
        position,
    });
}

/** Track category filter */
export function trackCategoryFilter(category: string) {
    logEvent(EVENTS.CATEGORY_FILTER, { category });
}

/** Track search */
export function trackSearch(query: string, resultsCount: number) {
    logEvent(EVENTS.SEARCH_COMPONENT, {
        query,
        results_count: resultsCount,
    });
}

// ─── Admin Auth (httpOnly cookie — no tokens in client) ──────────────────────

/** Login with username + password — session stored in httpOnly cookie */
export async function adminLogin(
    username: string,
    password: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const res = await fetch('/api/analytics/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'login', username, password }),
        });

        if (res.ok) {
            return { success: true };
        }

        const data = await res.json();
        return { success: false, error: data.error || 'Invalid credentials' };
    } catch {
        return { success: false, error: 'Network error' };
    }
}

/** Check if admin session is valid (cookie sent automatically by browser) */
export async function isAdminAuthenticated(): Promise<boolean> {
    try {
        const res = await fetch('/api/analytics/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'verify' }),
        });
        if (res.ok) {
            const data = await res.json();
            return data.valid === true;
        }
        return false;
    } catch {
        return false;
    }
}

/** Logout — server clears the httpOnly cookie */
export async function logoutAdmin(): Promise<void> {
    try {
        await fetch('/api/analytics/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'logout' }),
        });
    } catch {
        // Ignore
    }
}

// ─── Dashboard Data (fetched via server API) ─────────────────────────────────

/** Get global counters — requires admin session */
export async function getGlobalCounters(): Promise<{
    dev_count: number;
    total_views: number;
    total_copies: number;
    total_snack_opens: number;
}> {
    try {
        const res = await fetch('/api/analytics/track?type=global');
        if (res.ok) return await res.json();
        return { dev_count: 175, total_views: 0, total_copies: 0, total_snack_opens: 0 };
    } catch {
        return { dev_count: 175, total_views: 0, total_copies: 0, total_snack_opens: 0 };
    }
}

/** Get all component stats — requires admin session */
export async function getAllComponentStats(): Promise<
    Record<string, { views: number; copies: number; snack_opens: number }>
> {
    try {
        const res = await fetch('/api/analytics/track?type=components');
        if (res.ok) return await res.json();
        return {};
    } catch {
        return {};
    }
}

/** Get dev count (public — for the home page) */
export async function getDevCount(): Promise<number> {
    try {
        const res = await fetch('/api/analytics/track?type=dev_count');
        if (res.ok) {
            const data = await res.json();
            return data.dev_count || 175;
        }
        return 175;
    } catch {
        return 175;
    }
}
