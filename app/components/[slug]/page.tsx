import { notFound } from 'next/navigation';
import { getComponentBySlug, getAllComponents, getRelatedComponents } from '@/lib/registry';
import ComponentDetailClient from './ComponentDetailClient';
import type { Metadata } from 'next';

interface PageProps {
    params: Promise<{ slug: string }>;
}

/**
 * Pre-render all component pages at build time for maximum speed and SEO
 */
export async function generateStaticParams() {
    const components = await getAllComponents();
    return components.map((component) => ({
        slug: component.slug,
    }));
}

/**
 * Generate unique SEO metadata for EVERY component
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const component = await getComponentBySlug(slug);

    if (!component) return {};

    const title = `${component.name} - React Native Component`;
    const description = `Free React Native ${component.name} component. Copy-paste ready, zero dependencies, fully TypeScript. ${component.description}`;

    return {
        title,
        description,
        alternates: {
            canonical: `/components/${component.slug}`,
        },
        keywords: [
            `React Native ${component.name}`,
            `${component.name} component`,
            'React Native UI',
            'nativecn-ui',
            'copy paste React Native',
            component.category,
            ...component.features
        ],
        openGraph: {
            title,
            description,
            url: `https://nativecn-ui.vercel.app/components/${component.slug}`,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        }
    };
}

export default async function ComponentDetailPage({ params }: PageProps) {
    const { slug } = await params;

    // Fetch component data from registry using slug
    const component = await getComponentBySlug(slug);

    if (!component) {
        notFound();
    }

    // Fetch related components
    const relatedComponents = await getRelatedComponents(component.id, 3);

    // JSON-LD Structured Data for Google Rich Results
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: `${component.name} React Native Component`,
        description: component.description,
        programmingLanguage: 'TypeScript',
        runtimePlatform: 'React Native',
        url: `https://nativecn-ui.vercel.app/components/${component.slug}`,
        license: 'MIT',
        author: {
            '@type': 'Organization',
            name: 'nativecn-ui'
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ComponentDetailClient
                component={component}
                relatedComponents={relatedComponents}
            />
        </>
    );
}
