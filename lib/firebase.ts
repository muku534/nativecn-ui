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

// Initialize Firebase (client-side only — for Analytics)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics (only on client side and if supported)
let analytics: any = null;

if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, analytics };

// Helper to log events safely
export const logEvent = (eventName: string, eventParams?: { [key: string]: any }) => {
    if (analytics) {
        firebaseLogEvent(analytics, eventName, eventParams);
    } else {
        // In development or if analytics isn't supported, log to console
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Analytics] ${eventName}`, eventParams);
        }
    }
};