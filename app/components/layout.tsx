import { getAllComponents } from '@/lib/registry';
import ComponentsSidebar from './ComponentsSidebar';

export default async function ComponentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const components = await getAllComponents();

    return (
        <div className="flex min-h-screen pt-16">
            {/* Sidebar */}
            <ComponentsSidebar components={components} />
            
            {/* Main Content */}
            <main className="flex-1 w-full min-w-0 bg-background overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
