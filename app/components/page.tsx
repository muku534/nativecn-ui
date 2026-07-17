import { getAllComponents } from '@/lib/registry';
import ComponentsPageClient from './ComponentsPageClient';
import type { ComponentMetadata } from '@/lib/types';

export default async function ComponentsPage() {
    // Fetch all components to display in the grid
    const components = await getAllComponents();
    
    return <ComponentsPageClient components={components} />;
}
