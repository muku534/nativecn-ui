export const siteConfig = {
    name: "ComponentHub",
    description: "Premium React Native components you own. No package bloat. Just beautiful, performant code.",
    url: "https://componenthub.dev",
    creator: {
        name: "Mukesh Prajapati",
        role: "React Native Developer",
        location: "India",
        bio: "Passionate React Native developer building beautiful mobile experiences. Creating ComponentHub to help developers ship faster.",
    },
    socials: {
        github: "https://github.com/mukeshprajapati",
        twitter: "https://twitter.com/mukeshprajapati",
        linkedin: "https://linkedin.com/in/mukeshprajapati",
        reddit: "https://reddit.com/u/mukeshprajapati",
    },
};

export const navigation = [
    { name: 'Components', href: '/components' },
    { name: 'Docs', href: '/docs' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
];

export const footerLinks = {
    product: [
        { name: 'Components', href: '/components' },
        { name: 'Documentation', href: '/docs' },
        { name: 'Changelog', href: '#' },
        { name: 'Pricing', href: '#' },
    ],
    resources: [
        { name: 'Getting Started', href: '/docs/getting-started' },
        { name: 'Installation', href: '/docs/installation' },
        { name: 'Customization', href: '/docs/customization' },
        { name: 'Examples', href: '#' },
    ],
    company: [
        { name: 'About', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '#' },
        { name: 'Privacy', href: '#' },
    ],
};

export const features = [
    {
        title: 'Copy & Paste',
        description: 'No npm install required. Just copy the code and customize it to your needs.',
        icon: 'Clipboard',
    },
    {
        title: 'TypeScript First',
        description: 'All components are written in TypeScript with full type definitions.',
        icon: 'FileCode',
    },
    {
        title: 'Zero Dependencies',
        description: 'No external runtime dependencies. Your bundle stays lean and fast.',
        icon: 'Package',
    },
    {
        title: 'Fully Customizable',
        description: 'Every component is built to be easily customized to match your design.',
        icon: 'Palette',
    },
    {
        title: 'Mobile Optimized',
        description: 'Built for React Native with smooth 60fps animations and gestures.',
        icon: 'Smartphone',
    },
    {
        title: 'Production Ready',
        description: 'Battle-tested in production apps serving millions of users.',
        icon: 'Shield',
    },
];

export const stats = [
    { value: '9+', label: 'Components' },
    { value: '0', label: 'Dependencies' },
    { value: '100%', label: 'TypeScript' },
    { value: '∞', label: 'Possibilities' },
];

export const components = [
    { name: 'Button', category: 'Form', description: 'Interactive button with multiple variants' },
    { name: 'Card', category: 'Layout', description: 'Flexible container for content' },
    { name: 'Input', category: 'Form', description: 'Text input with validation support' },
    { name: 'Modal', category: 'Overlay', description: 'Dialog overlay component' },
    { name: 'Toast', category: 'Feedback', description: 'Brief notification messages' },
    { name: 'Switch', category: 'Form', description: 'Toggle switch control' },
    { name: 'Tabs', category: 'Navigation', description: 'Tab navigation component' },
    { name: 'Avatar', category: 'Display', description: 'User avatar with fallback' },
    { name: 'Badge', category: 'Display', description: 'Status badges and labels' },
];

export const docsNavigation = [
    {
        title: 'Getting Started',
        items: [
            { name: 'Introduction', href: '/docs' },
            { name: 'Getting Started', href: '/docs/getting-started' },
            { name: 'Installation', href: '/docs/installation' },
            { name: 'Customization', href: '/docs/customization' },
        ],
    },
    {
        title: 'Input Components',
        items: [
            { name: 'Range Slider', href: '/components/range-slider' },
            { name: 'Switch Toggle', href: '/components/switch-toggle' },
            { name: 'Date Picker', href: '/components/date-picker' },
        ],
    },
    {
        title: 'Navigation Components',
        items: [
            { name: 'Animated Tab Bar', href: '/components/animated-tab-bar' },
            { name: 'Animated Bottom Navigation', href: '/components/animated-bottom-navigation' },
        ],
    },
    {
        title: 'Button Components',
        items: [
            { name: 'Rainbow Button', href: '/components/rainbow-button' },
            { name: 'Floating Action Button', href: '/components/floating-action-button' },
        ],
    },
    {
        title: 'Other Components',
        items: [
            { name: 'Dynamic Bottom Sheet', href: '/components/dynamic-bottom-sheet' },
            { name: 'Skeleton Loader', href: '/components/skeleton-loader' },
        ],
    },
];
