// Component Registry Types for ComponentHub
// These types define the structure of component data

export interface ComponentProp {
    name: string;
    type: string;
    required: boolean;
    default?: string;
    description: string;
}

export interface UsageExample {
    title: string;
    description: string;
    code: string;
}

export interface ComponentDependencies {
    required: string[];
    optional: string[];
}

export interface ComponentInstallation {
    steps: string[];
    nativeSetup?: string[];
}

export interface ComponentMetadata {
    id: string;
    name: string;
    category: 'Navigation' | 'Input' | 'Button' | 'Modal' | 'Loading';
    description: string;
    longDescription: string;
    gradient: string;
    emoji: string;
    dependencies: ComponentDependencies;
    features: string[];
    props: ComponentProp[];
    usage: UsageExample[];
    version: string;
    lastUpdated: string;
    difficulty: 'Easy' | 'Medium' | 'Advanced';
    codePreview: string;
    installation: ComponentInstallation;
    files?: string[];
}

// Registry index entry (lightweight for listing)
export interface RegistryEntry {
    id: string;
    path: string;
    category: ComponentMetadata['category'];
    difficulty: ComponentMetadata['difficulty'];
    version: string;
}

// Master registry structure
export interface Registry {
    version: string;
    lastUpdated: string;
    components: RegistryEntry[];
}

// Full component data with source code
export interface ComponentData extends ComponentMetadata {
    fullCode: {
        typescript: string;
        javascript: string;
    };
    nativeFiles?: Record<string, string>;
}

// Legacy type for backwards compatibility during migration
export type LegacyComponentData = ComponentData;
