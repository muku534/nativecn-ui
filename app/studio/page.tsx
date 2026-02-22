import type { Metadata } from 'next';
import StudioLandingClient from '@/components/studio/StudioLandingClient';

export const metadata: Metadata = {
    title: 'Form Studio | nativecn-ui',
    description: 'A premium visual builder for React Native components. Drag, drop, configure, and export production-ready code instantly.',
};

export default function StudioLandingPage() {
    return <StudioLandingClient />;
}
