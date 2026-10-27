import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, logEvent as firebaseLogEvent } from "firebase/analytics";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const hasConfig = Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);

// Initialize Firebase (client-side only - for Analytics)
const app = hasConfig
    ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
    : null;

// Initialize Analytics (only on client side and if supported)
let analytics: any = null;

if (typeof window !== 'undefined' && app && hasConfig) {
    isSupported().then((supported) => {
        if (supported) {
            try {
                analytics = getAnalytics(app);
            } catch (e) {
                // Silently fallback in development if config is partial
            }
        }
    }).catch(() => {});
}

export { app, analytics };

// Helper to log events safely
export const logEvent = (eventName: string, eventParams?: { [key: string]: any }) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] ${eventName}`, eventParams);
        return;
    }

    if (analytics) {
        firebaseLogEvent(analytics, eventName, eventParams);
    }
};