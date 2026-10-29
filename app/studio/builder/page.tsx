import type { Metadata } from 'next';
import InteractiveStudioClient from '@/components/studio/InteractiveStudioClient';

export const metadata: Metadata = {
    title: 'Studio Builder | nativecn-ui',
    description: 'Explore, test, and feel React Native components in real-time inside a realistic device simulator. Tweak props with live inspector and copy production-ready code.',
};

export default function StudioBuilderPage() {
    return <InteractiveStudioClient />;
}
