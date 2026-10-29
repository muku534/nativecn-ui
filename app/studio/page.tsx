import type { Metadata } from 'next';
import InteractiveStudioClient from '@/components/studio/InteractiveStudioClient';

export const metadata: Metadata = {
    title: 'Component Studio | nativecn-ui',
    description: 'Experience real device feel for React Native components. Explore, test, feel animations, customize with live inspector, and copy production-ready code.',
};

export default function StudioPage() {
    return <InteractiveStudioClient />;
}
