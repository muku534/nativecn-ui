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

export interface ComponentData {
    id: string;
    name: string;
    category: 'Navigation' | 'Input' | 'Button' | 'Modal' | 'Loading';
    description: string;
    longDescription: string;
    gradient: string;
    emoji: string;
    dependencies: {
        required: string[];
        optional: string[];
    };
    features: string[];
    props: ComponentProp[];
    usage: UsageExample[];
    version: string;
    lastUpdated: string;
    difficulty: 'Easy' | 'Medium' | 'Advanced';
    codePreview: string;
    fullCode: {
        typescript: string;
        javascript: string;
    };
    installation: {
        steps: string[];
        nativeSetup?: string[];
    };
}

export const components: ComponentData[] = [
    {
        id: 'range-slider',
        name: 'Range Slider',
        category: 'Input',
        description: 'Animated slider with step snapping and haptic feedback',
        longDescription: 'A fully customizable range slider component with smooth animations, step snapping, and optional haptic feedback. Built with React Native Animated API for 60fps performance.',
        gradient: 'from-blue-500 to-cyan-500',
        emoji: '🎚️',
        dependencies: { required: [], optional: ['react-native-haptic-feedback'] },
        features: ['Smooth 60fps animations', 'Step snapping with configurable intervals', 'Haptic feedback on value change', 'Fully customizable colors and sizes', 'TypeScript support', 'Works on iOS and Android'],
        props: [
            { name: 'value', type: 'number', required: true, description: 'Current value of the slider' },
            { name: 'onValueChange', type: '(value: number) => void', required: true, description: 'Callback fired when slider value changes' },
            { name: 'min', type: 'number', required: false, default: '0', description: 'Minimum value' },
            { name: 'max', type: 'number', required: false, default: '100', description: 'Maximum value' },
            { name: 'step', type: 'number', required: false, default: '1', description: 'Step increment' },
            { name: 'hapticEnabled', type: 'boolean', required: false, default: 'true', description: 'Enable haptic feedback' },
        ],
        usage: [
            { title: 'Basic Usage', description: 'Simple price filter slider', code: `const [price, setPrice] = useState(50);\n\n<RangeSlider\n  value={price}\n  onValueChange={setPrice}\n  min={0}\n  max={1000}\n  step={10}\n/>` },
        ],
        version: '1.0.0',
        lastUpdated: '2026-02-02',
        difficulty: 'Easy',
        codePreview: `<RangeSlider\n  value={value}\n  onValueChange={setValue}\n  min={0}\n  max={100}\n/>`,
        fullCode: { typescript: '// Full TypeScript implementation available in docs', javascript: '// Full JavaScript implementation available in docs' },
        installation: { steps: ['Copy RangeSlider.tsx to your components folder', 'Copy responsive.ts utility file', 'Import and use in your screen'], nativeSetup: ['npm install react-native-haptic-feedback (optional)', 'cd ios && pod install (for iOS haptics)'] },
    },
    {
        id: 'animated-tab-bar',
        name: 'Animated Tab Bar',
        category: 'Navigation',
        description: 'Sliding indicator with smooth transitions and scale effects',
        longDescription: 'A beautifully animated tab bar component with a sliding indicator, scale effects on active tabs, and smooth transitions. Perfect for segmented controls or navigation tabs.',
        gradient: 'from-purple-500 to-pink-500',
        emoji: '📱',
        dependencies: { required: [], optional: ['react-native-haptic-feedback'] },
        features: ['Smooth sliding indicator animation', 'Scale and opacity effects on tabs', 'Customizable colors and styling', 'Haptic feedback on tab change', 'Dynamic number of tabs', 'TypeScript ready'],
        props: [
            { name: 'tabs', type: 'string[]', required: true, description: 'Array of tab labels' },
            { name: 'activeTab', type: 'string', required: true, description: 'Currently active tab' },
            { name: 'onTabChange', type: '(tab: string) => void', required: true, description: 'Callback when tab changes' },
            { name: 'hapticEnabled', type: 'boolean', required: false, default: 'true', description: 'Enable haptic feedback' },
        ],
        usage: [
            { title: 'Basic Usage', description: 'Simple segmented control', code: `const [activeTab, setActiveTab] = useState('All');\n\n<AnimatedTabBar\n  tabs={['All', 'Active', 'Completed']}\n  activeTab={activeTab}\n  onTabChange={setActiveTab}\n/>` },
        ],
        version: '1.0.0',
        lastUpdated: '2026-02-02',
        difficulty: 'Easy',
        codePreview: `<AnimatedTabBar\n  tabs={['Tab 1', 'Tab 2', 'Tab 3']}\n  activeTab={activeTab}\n  onTabChange={setActiveTab}\n/>`,
        fullCode: { typescript: '// Full TypeScript implementation available in docs', javascript: '// Full JavaScript implementation available in docs' },
        installation: { steps: ['Copy AnimatedTabBar.tsx to your components folder', 'Copy responsive.ts and haptics.ts utilities', 'Import and use'] },
    },
    {
        id: 'skeleton-loader',
        name: 'Skeleton Loader',
        category: 'Loading',
        description: 'Shimmer effect with pre-built variants for cards and lists',
        longDescription: 'A versatile skeleton loader component with shimmer animation. Includes pre-built variants for common UI patterns like cards, list items, and text blocks.',
        gradient: 'from-slate-500 to-slate-700',
        emoji: '⚡',
        dependencies: { required: [], optional: [] },
        features: ['Smooth shimmer animation', 'Pre-built variants (Card, ListItem, Text, Avatar)', 'Fully customizable dimensions', 'Group multiple skeletons', 'Zero dependencies', 'Light and dark mode support'],
        props: [
            { name: 'width', type: 'DimensionValue', required: true, description: 'Width of the skeleton' },
            { name: 'height', type: 'DimensionValue', required: true, description: 'Height of the skeleton' },
            { name: 'borderRadius', type: 'number', required: false, default: '8', description: 'Border radius' },
            { name: 'backgroundColor', type: 'string', required: false, default: '#E5E7EB', description: 'Background color' },
        ],
        usage: [
            { title: 'Basic Skeleton', description: 'Simple skeleton placeholder', code: `<SkeletonLoader width={200} height={20} />` },
            { title: 'Using Variants', description: 'Pre-built skeleton patterns', code: `<SkeletonVariants.Card width={350} imageHeight={200} />\n<SkeletonVariants.ListItem avatarSize={48} />` },
        ],
        version: '1.0.0',
        lastUpdated: '2026-02-02',
        difficulty: 'Easy',
        codePreview: `<SkeletonLoader\n  width={200}\n  height={100}\n  borderRadius={12}\n/>`,
        fullCode: { typescript: '// Full TypeScript implementation available in docs', javascript: '// Full JavaScript implementation available in docs' },
        installation: { steps: ['Copy SkeletonLoader.tsx to your components folder', 'Copy responsive.ts utility', 'Import and use'] },
    },
    {
        id: 'rainbow-button',
        name: 'Rainbow Button',
        category: 'Button',
        description: 'Animated gradient border with SVG stroke animation',
        longDescription: 'An eye-catching button component with an animated rainbow gradient border. Uses SVG for smooth stroke animations that travel around the button perimeter.',
        gradient: 'from-red-500 via-yellow-500 to-blue-500',
        emoji: '🌈',
        dependencies: { required: ['react-native-svg'], optional: [] },
        features: ['Animated gradient border effect', 'Customizable gradient colors', 'Adjustable animation speed', 'Static or animated modes', 'Press feedback', 'Fully customizable size'],
        props: [
            { name: 'width', type: 'number', required: true, description: 'Width of the button' },
            { name: 'height', type: 'number', required: true, description: 'Height of the button' },
            { name: 'children', type: 'ReactNode', required: true, description: 'Button content' },
            { name: 'onPress', type: '() => void', required: false, description: 'Press handler' },
            { name: 'animated', type: 'boolean', required: false, default: 'true', description: 'Enable border animation' },
        ],
        usage: [
            { title: 'Basic Usage', description: 'Simple rainbow button', code: `<RainbowButton\n  width={200}\n  height={50}\n  onPress={() => console.log('Pressed')}\n>\n  <Text>Premium Feature</Text>\n</RainbowButton>` },
        ],
        version: '1.0.0',
        lastUpdated: '2026-02-02',
        difficulty: 'Medium',
        codePreview: `<RainbowButton width={200} height={50}>\n  <Text>Click Me</Text>\n</RainbowButton>`,
        fullCode: { typescript: '// Full TypeScript implementation available in docs', javascript: '// Full JavaScript implementation available in docs' },
        installation: { steps: ['npm install react-native-svg', 'cd ios && pod install', 'Copy RainbowButton.tsx to components', 'Import and use'], nativeSetup: ['iOS: Pod install handles setup', 'Android: Auto-linked in RN 0.60+'] },
    },
    {
        id: 'bottom-sheet',
        name: 'Dynamic Bottom Sheet',
        category: 'Modal',
        description: 'Auto-height modal with drag gestures and backdrop',
        longDescription: 'A flexible bottom sheet modal that automatically adjusts to content height. Features drag-to-close gestures, customizable backdrop, and keyboard avoidance.',
        gradient: 'from-indigo-500 to-purple-500',
        emoji: '📋',
        dependencies: { required: [], optional: ['react-native-haptic-feedback'] },
        features: ['Dynamic height based on content', 'Drag to dismiss gesture', 'Keyboard avoiding behavior', 'Customizable backdrop', 'Imperative API (open/close)', 'Smooth spring animations'],
        props: [
            { name: 'children', type: 'ReactNode', required: true, description: 'Content to render inside sheet' },
            { name: 'onClose', type: '() => void', required: false, description: 'Callback when sheet closes' },
            { name: 'maxHeightPercent', type: 'number', required: false, default: '0.9', description: 'Max height as screen percentage' },
            { name: 'dragEnabled', type: 'boolean', required: false, default: 'true', description: 'Enable drag to close' },
        ],
        usage: [
            { title: 'Basic Usage', description: 'Using with useRef', code: `const sheetRef = useRef<BottomSheetRef>(null);\n\n<Button onPress={() => sheetRef.current?.open()}>\n  Open Sheet\n</Button>\n\n<DynamicBottomSheet ref={sheetRef}>\n  <View style={{ padding: 20 }}>\n    <Text>Sheet Content</Text>\n  </View>\n</DynamicBottomSheet>` },
        ],
        version: '1.0.0',
        lastUpdated: '2026-02-02',
        difficulty: 'Medium',
        codePreview: `const sheetRef = useRef<BottomSheetRef>(null);\n\n<DynamicBottomSheet ref={sheetRef}>\n  <Content />\n</DynamicBottomSheet>`,
        fullCode: { typescript: '// Full TypeScript implementation available in docs', javascript: '// Full JavaScript implementation available in docs' },
        installation: { steps: ['Copy DynamicBottomSheet.tsx to components', 'Copy responsive.ts and haptics.ts utilities', 'Import and use with useRef'] },
    },
    {
        id: 'switch-toggle',
        name: 'Switch Toggle',
        category: 'Input',
        description: 'Smooth animated toggle with spring physics',
        longDescription: 'A beautifully animated switch component with spring physics and color interpolation. Features smooth transitions, customizable colors, and optional haptic feedback.',
        gradient: 'from-green-500 to-emerald-500',
        emoji: '🔘',
        dependencies: { required: [], optional: ['react-native-haptic-feedback'] },
        features: ['Spring physics animation', 'Color interpolation on state change', 'Scale effect on thumb', 'Haptic feedback support', 'Fully customizable colors', 'Disabled state support'],
        props: [
            { name: 'value', type: 'boolean', required: true, description: 'Current toggle state' },
            { name: 'onValueChange', type: '(value: boolean) => void', required: true, description: 'Callback when toggle changes' },
            { name: 'disabled', type: 'boolean', required: false, default: 'false', description: 'Disabled state' },
        ],
        usage: [
            { title: 'Basic Usage', description: 'Simple toggle switch', code: `const [enabled, setEnabled] = useState(false);\n\n<SwitchToggle\n  value={enabled}\n  onValueChange={setEnabled}\n/>` },
        ],
        version: '1.0.0',
        lastUpdated: '2026-02-02',
        difficulty: 'Easy',
        codePreview: `<SwitchToggle\n  value={enabled}\n  onValueChange={setEnabled}\n/>`,
        fullCode: { typescript: '// Full TypeScript implementation available in docs', javascript: '// Full JavaScript implementation available in docs' },
        installation: { steps: ['Copy SwitchToggle.tsx to components', 'Copy utilities (responsive.ts, haptics.ts)', 'Import and use'] },
    },
    {
        id: 'bottom-navigation',
        name: 'Animated Bottom Navigation',
        category: 'Navigation',
        description: 'Animated nav bar with floating style and active indicator',
        longDescription: 'A modern bottom navigation component with smooth animations, floating style option, and active tab indicator. Features bounce animations and icon highlighting.',
        gradient: 'from-blue-500 to-indigo-500',
        emoji: '🧭',
        dependencies: { required: [], optional: ['react-native-haptic-feedback'] },
        features: ['Floating or standard style', 'Animated active indicator', 'Bounce effect on tab press', 'Optional labels under icons', 'Safe area padding support', 'Customizable colors'],
        props: [
            { name: 'tabs', type: 'TabItem[]', required: true, description: 'Array of tab items with icons' },
            { name: 'activeTab', type: 'string', required: true, description: 'Currently active tab key' },
            { name: 'onTabChange', type: '(tabKey: string) => void', required: true, description: 'Callback when tab changes' },
            { name: 'floating', type: 'boolean', required: false, default: 'false', description: 'Enable floating style' },
        ],
        usage: [
            { title: 'Basic Usage', description: 'Bottom navigation with icons', code: `const tabs = [\n  { key: 'home', icon: <Home />, label: 'Home' },\n  { key: 'search', icon: <Search />, label: 'Search' },\n];\n\n<AnimatedBottomNav\n  tabs={tabs}\n  activeTab={activeTab}\n  onTabChange={setActiveTab}\n  floating\n/>` },
        ],
        version: '1.0.0',
        lastUpdated: '2026-02-02',
        difficulty: 'Medium',
        codePreview: `<AnimatedBottomNav\n  tabs={tabs}\n  activeTab={activeTab}\n  onTabChange={setActiveTab}\n  floating\n/>`,
        fullCode: { typescript: '// Full TypeScript implementation available in docs', javascript: '// Full JavaScript implementation available in docs' },
        installation: { steps: ['Copy AnimatedBottomNav.tsx to components', 'Copy utilities', 'Import your icon library', 'Setup navigation structure'] },
    },
    {
        id: 'floating-speed-dial',
        name: 'Floating Action Button',
        category: 'Button',
        description: 'Expandable FAB menu with gradient background',
        longDescription: 'A floating action button that expands into a speed dial menu. Features gradient background, smooth animations, backdrop overlay, and customizable action buttons.',
        gradient: 'from-orange-500 to-red-500',
        emoji: '➕',
        dependencies: { required: ['react-native-linear-gradient'], optional: ['react-native-haptic-feedback'] },
        features: ['Expandable menu animation', 'Gradient FAB background', 'Backdrop overlay when open', 'Customizable action buttons', 'Rotation animation on main FAB', 'Position customization'],
        props: [
            { name: 'actions', type: 'ActionItem[]', required: true, description: 'Array of action items' },
            { name: 'icon', type: 'ReactNode', required: true, description: 'Main FAB icon when closed' },
            { name: 'openIcon', type: 'ReactNode', required: false, description: 'Icon when open' },
            { name: 'gradientColors', type: 'string[]', required: false, default: "['#EC4899', '#F97316']", description: 'Gradient colors for FAB' },
        ],
        usage: [
            { title: 'Basic Usage', description: 'FAB with action menu', code: `const actions = [\n  { key: 'camera', icon: <Camera />, onPress: () => {} },\n  { key: 'gallery', icon: <Image />, onPress: () => {} },\n];\n\n<FloatingSpeedDial\n  actions={actions}\n  icon={<Plus />}\n/>` },
        ],
        version: '1.0.0',
        lastUpdated: '2026-02-02',
        difficulty: 'Advanced',
        codePreview: `<FloatingSpeedDial\n  actions={actions}\n  icon={<Plus />}\n  gradientColors={['#EC4899', '#F97316']}\n/>`,
        fullCode: { typescript: '// Full TypeScript implementation available in docs', javascript: '// Full JavaScript implementation available in docs' },
        installation: { steps: ['npm install react-native-linear-gradient', 'cd ios && pod install', 'Copy FloatingSpeedDial.tsx to components', 'Import and use'], nativeSetup: ['iOS: Pod install handles setup', 'Android: Auto-linked in RN 0.60+'] },
    },
    {
        id: 'date-picker',
        name: 'Date Picker',
        category: 'Input',
        description: 'Modal calendar picker with custom styling',
        longDescription: 'A beautiful modal date picker with calendar view, date range constraints, and custom theming. Built on react-native-calendars with additional styling improvements.',
        gradient: 'from-pink-500 to-rose-500',
        emoji: '📅',
        dependencies: { required: ['react-native-calendars'], optional: ['react-native-haptic-feedback'] },
        features: ['Modal calendar interface', 'Date range constraints (min/max)', 'Custom color theming', 'Error state support', 'Required field indicator', 'Formatted date display'],
        props: [
            { name: 'value', type: 'Date | undefined', required: false, description: 'Currently selected date' },
            { name: 'onDateChange', type: '(date: Date) => void', required: true, description: 'Callback when date selected' },
            { name: 'minimumDate', type: 'Date', required: false, description: 'Earliest selectable date' },
            { name: 'maximumDate', type: 'Date', required: false, description: 'Latest selectable date' },
            { name: 'label', type: 'string', required: false, description: 'Label text above picker' },
            { name: 'required', type: 'boolean', required: false, default: 'false', description: 'Show required indicator' },
        ],
        usage: [
            { title: 'Basic Usage', description: 'Simple date picker', code: `const [date, setDate] = useState<Date>();\n\n<DatePicker\n  label="Booking Date"\n  value={date}\n  onDateChange={setDate}\n  minimumDate={new Date()}\n  required\n/>` },
        ],
        version: '1.0.0',
        lastUpdated: '2026-02-02',
        difficulty: 'Medium',
        codePreview: `<DatePicker\n  value={date}\n  onDateChange={setDate}\n  label="Select Date"\n/>`,
        fullCode: { typescript: '// Full TypeScript implementation available in docs', javascript: '// Full JavaScript implementation available in docs' },
        installation: { steps: ['npm install react-native-calendars', 'Copy DatePicker.tsx to components', 'Copy utilities', 'Import and use in forms'], nativeSetup: ['No native setup required', 'Works on both iOS and Android'] },
    },
];
