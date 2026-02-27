'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { trackVisitor } from '@/lib/analytics';
import { logEvent } from '@/lib/firebase';
function Analytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        trackVisitor();
    }, []);

    useEffect(() => {
        if (pathname) {
            logEvent('page_view', {
                page_path: pathname,
                search_params: searchParams.toString(),
            });
        }
    }, [pathname, searchParams]);

    return null;
}

export default function AnalyticsProvider() {
    return (
        <Suspense fallback={null}>
            <Analytics />
        </Suspense>
    );
}
