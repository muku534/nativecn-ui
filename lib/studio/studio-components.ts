// Studio Components Catalog & Inspector Schema for nativecn-ui
// Analyzed directly from registry/components/ - defines exact controls, defaults, categories, and code generators for all 22 components

export interface ControlDef {
    id: string;
    label: string;
    description?: string;
    type: 'slider' | 'switch' | 'select' | 'color' | 'text';
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    options?: { label: string; value: string }[];
    palette?: string[];
    defaultValue: any;
    section?: string;
}

export interface StudioComponentItem {
    id: string;
    name: string;
    category: 'Navigation' | 'Inputs' | 'Display' | 'Feedback' | 'Buttons' | 'Modals' | 'Loading';
    typeSubtitle: string;
    color: string;
    icon: string;
    description: string;
    snackId?: string;
    controls: ControlDef[];
    defaultProps: Record<string, any>;
    generateCode: (props: Record<string, any>) => string;
}

export const STUDIO_CATEGORIES = [
    'All',
    'Navigation',
    'Inputs',
    'Display',
    'Feedback',
    'Buttons',
    'Modals',
    'Loading',
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
    Navigation: '#38BDF8',
    Inputs: '#10B981',
    Display: '#F59E0B',
    Feedback: '#818CF8',
    Buttons: '#EC4899',
    Modals: '#A855F7',
    Loading: '#6366F1',
};

export const STUDIO_COMPONENTS: StudioComponentItem[] = [
    // ─── 1. Stars Globe ──────────────────────────────────────────────────────────
    {
        id: 'stars-globe',
        name: 'Animated Stars Globe',
        category: 'Display',
        typeSubtitle: 'Display · 3D Skia & SVG',
        color: '#F59E0B',
        icon: '🌍',
        description: 'Interactive rotating 3D dot globe seamlessly morphing into a flat projection map with live radar beacons.',
        snackId: '@mr.mukesh/animated-stars-globe',
        controls: [
            {
                id: 'mode',
                label: 'Projection Mode',
                description: 'Morph between 3D sphere and 2D flat planar map',
                type: 'select',
                section: 'Projection',
                options: [
                    { label: '3D Globe', value: 'globe' },
                    { label: '2D Flat Map', value: 'flat' },
                    { label: 'Auto Cycle', value: 'auto' },
                ],
                defaultValue: 'globe',
            },
            {
                id: 'selectedCountry',
                label: 'Target Country Telemetry',
                description: 'Highlight country coordinates on globe / flat map',
                type: 'select',
                section: 'Projection',
                options: [
                    { label: 'United States (US)', value: 'US' },
                    { label: 'India (IN)', value: 'IN' },
                    { label: 'United Kingdom (GB)', value: 'GB' },
                    { label: 'Japan (JP)', value: 'JP' },
                    { label: 'Singapore (SG)', value: 'SG' },
                ],
                defaultValue: 'US',
            },
            {
                id: 'rotationSpeed',
                label: 'Orbital Speed',
                description: 'Continuous rotation velocity in RPM',
                type: 'slider',
                min: 0,
                max: 60,
                step: 2,
                unit: 'rpm',
                section: 'Physics',
                defaultValue: 20,
            },
            {
                id: 'oceanOpacity',
                label: 'Ocean Dot Opacity',
                description: 'Subtle background oceanic matrix intensity',
                type: 'slider',
                min: 0.05,
                max: 0.5,
                step: 0.05,
                unit: '',
                section: 'Appearance',
                defaultValue: 0.18,
            },
            {
                id: 'landColor',
                label: 'Continent Color',
                description: 'Primary color for illuminated landmass nodes',
                type: 'color',
                section: 'Appearance',
                palette: ['#00D4FF', '#38BDF8', '#10B981', '#F59E0B', '#EC4899', '#FFFFFF'],
                defaultValue: '#00D4FF',
            },
            {
                id: 'showBeacons',
                label: 'Radar Beacons',
                description: 'Pulse active metropolitan radar beacons',
                type: 'switch',
                section: 'Interaction',
                defaultValue: true,
            },
        ],
        defaultProps: {
            mode: 'globe',
            selectedCountry: 'US',
            rotationSpeed: 20,
            oceanOpacity: 0.18,
            landColor: '#00D4FF',
            showBeacons: true,
        },
        generateCode: (props) => `import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import StarsGlobe from './components/StarsGlobe';

const { width } = Dimensions.get('window');

export default function StarsGlobeDemo() {
  const [mode, setMode] = useState<'globe' | 'flat'>('${props.mode || 'globe'}');

  return (
    <View style={styles.container}>
      <StarsGlobe
        mode={mode}
        onModeChange={setMode}
        size={Math.min(width - 20, 390)}
        selectedCountryCode="${props.selectedCountry || 'US'}"
        autoRotateSpeed={${props.rotationSpeed || 20}}
        oceanDotColor="${props.landColor || '#FFFFFF'}"
        showCustomizationControls={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
  },
});`,
    },

    // ─── 2. Animated Tab Bar ─────────────────────────────────────────────────────
    {
        id: 'animated-tab-bar',
        name: 'Animated Tab Bar',
        category: 'Navigation',
        typeSubtitle: 'Navigation · Smooth Indicator',
        color: '#38BDF8',
        icon: '📱',
        description: 'Sliding indicator tab bar with spring physics, scale pop effects, and active state transitions.',
        snackId: '@mr.mukesh/animated-tab-bar',
        controls: [
            {
                id: 'activeColor',
                label: 'Active Text & Pill Tint',
                description: 'Highlight color for selected tab (BrightPink default)',
                type: 'color',
                section: 'Colors',
                palette: ['#FF0080', '#0A84FF', '#10B981', '#F59E0B', '#111827'],
                defaultValue: '#FF0080',
            },
            {
                id: 'backgroundColor',
                label: 'Container Surface',
                description: 'Base background pill tone',
                type: 'color',
                section: 'Colors',
                palette: ['#F5F5F5', '#18181B', '#FFFFFF', '#27272A'],
                defaultValue: '#F5F5F5',
            },
            {
                id: 'tabCount',
                label: 'Tab Items Count',
                description: 'Configure tab slots',
                type: 'select',
                section: 'Layout',
                options: [
                    { label: '3 Tabs (Pay, Request, Scan)', value: '3' },
                    { label: '4 Tabs (Home, Pay, Cards, More)', value: '4' },
                    { label: '5 Tabs (Full Suite)', value: '5' },
                ],
                defaultValue: '3',
            },
            {
                id: 'hapticEnabled',
                label: 'Haptic Feedback',
                description: 'Trigger subtle selection haptic on tab change',
                type: 'switch',
                section: 'Interaction',
                defaultValue: true,
            },
        ],
        defaultProps: {
            activeColor: '#FF0080',
            backgroundColor: '#F5F5F5',
            tabCount: '3',
            hapticEnabled: true,
        },
        generateCode: (props) => {
            const tabs = props.tabCount === '4'
                ? "['Home', 'Pay', 'Cards', 'More']"
                : props.tabCount === '5'
                ? "['Home', 'Search', 'Pay', 'Bell', 'User']"
                : "['Pay', 'Request', 'Scan']";
            return `import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AnimatedTabBar from './components/AnimatedTabBar';

export default function TabBarDemo() {
  const [activeTab, setActiveTab] = useState('Pay');

  return (
    <View style={styles.container}>
      <AnimatedTabBar
        tabs={${tabs}}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeColor="${props.activeColor || '#FF0080'}"
        backgroundColor="${props.backgroundColor || '#F5F5F5'}"
        hapticEnabled={${props.hapticEnabled ? 'true' : 'false'}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    justifyContent: 'flex-end',
    paddingBottom: 24,
  },
});`;
        },
    },

    // ─── 3. Animated Bottom Navigation ───────────────────────────────────────────
    {
        id: 'bottom-navigation',
        name: 'Animated Bottom Nav',
        category: 'Navigation',
        typeSubtitle: 'Navigation · Floating Island',
        color: '#38BDF8',
        icon: '🧭',
        description: 'Floating pill navigation bar with active spring backdrop highlight, icon bounce, and elevation.',
        snackId: '@mr.mukesh/bottom-navigation',
        controls: [
            {
                id: 'activeColor',
                label: 'Active Tint Color',
                description: 'Highlighted tab indicator and icon color',
                type: 'color',
                section: 'Colors',
                palette: ['#FF0080', '#0A84FF', '#10B981', '#111827'],
                defaultValue: '#FF0080',
            },
            {
                id: 'backgroundColor',
                label: 'Bar Background Color',
                description: 'Floating container pill surface tone',
                type: 'color',
                section: 'Colors',
                palette: ['#FFFFFF', '#1C1C1E', '#F5F5F5'],
                defaultValue: '#FFFFFF',
            },
            {
                id: 'elevation',
                label: 'Elevation Depth',
                description: 'Floating shadow intensity',
                type: 'slider',
                min: 4,
                max: 20,
                step: 2,
                unit: 'pt',
                section: 'Style',
                defaultValue: 10,
            },
            {
                id: 'hapticEnabled',
                label: 'Haptic Feedback',
                description: 'Tactile pop on tab transition',
                type: 'switch',
                section: 'Behavior',
                defaultValue: true,
            },
        ],
        defaultProps: {
            activeColor: '#FF0080',
            backgroundColor: '#FFFFFF',
            elevation: 10,
            hapticEnabled: true,
        },
        generateCode: (props) => `import React from 'react';
import { View, StyleSheet } from 'react-native';
import AnimatedBottomNav from './components/AnimatedBottomNav';

export default function BottomNavDemo() {
  return (
    <View style={styles.container}>
      <AnimatedBottomNav
        activeColor="${props.activeColor || '#FF0080'}"
        backgroundColor="${props.backgroundColor || '#FFFFFF'}"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'flex-end',
  },
});`,
    },

    // ─── 4. Dynamic Bottom Sheet ─────────────────────────────────────────────────
    {
        id: 'bottom-sheet',
        name: 'Dynamic Bottom Sheet',
        category: 'Modals',
        typeSubtitle: 'Modal · Gesture Sheet',
        color: '#A855F7',
        icon: '📋',
        description: 'Spring slide-up modal with drag handle bar, backdrop scrim, and interactive height anchoring.',
        snackId: '@mr.mukesh/bottom-sheet',
        controls: [
            {
                id: 'height',
                label: 'Sheet Height',
                description: 'Viewport height percentage occupied',
                type: 'slider',
                min: 40,
                max: 90,
                step: 5,
                unit: '%',
                section: 'Dimensions',
                defaultValue: 70,
            },
            {
                id: 'handleBar',
                label: 'Show Drag Handle',
                description: 'Pill indicator at top of modal',
                type: 'switch',
                section: 'Appearance',
                defaultValue: true,
            },
        ],
        defaultProps: {
            height: 70,
            handleBar: true,
        },
        generateCode: (props) => `import React, { useRef } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import DynamicBottomSheet, { BottomSheetRef } from './components/DynamicBottomSheet';

export default function BottomSheetDemo() {
  const sheetRef = useRef<BottomSheetRef>(null);

  return (
    <View style={styles.container}>
      <Button title="Open Sheet" onPress={() => sheetRef.current?.open()} />
      <DynamicBottomSheet
        ref={sheetRef}
        height="${props.height || 70}%"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
});`,
    },

    // ─── 5. Custom Form Input ────────────────────────────────────────────────────
    {
        id: 'custom-input',
        name: 'Custom Form Input',
        category: 'Inputs',
        typeSubtitle: 'Input · Multi-Variant Field',
        color: '#10B981',
        icon: '✍️',
        description: 'Multi-variant input field with search icons, password reveal toggle, clear button, and error states.',
        snackId: '@mr.mukesh/custom-input',
        controls: [
            {
                id: 'variant',
                label: 'Visual Variant',
                description: 'Exact border & surface style preset',
                type: 'select',
                section: 'Style',
                options: [
                    { label: 'Outlined (Border 2px)', value: 'outlined' },
                    { label: 'Filled (Solid Surface)', value: 'filled' },
                    { label: 'Underlined (Bottom Border)', value: 'underlined' },
                    { label: 'Search Pill (Magnifying Glass)', value: 'search' },
                    { label: 'Default', value: 'default' },
                ],
                defaultValue: 'outlined',
            },
            {
                id: 'size',
                label: 'Size Preset',
                description: 'Height and typography scale',
                type: 'select',
                section: 'Style',
                options: [
                    { label: 'Small (36px)', value: 'small' },
                    { label: 'Medium (44px)', value: 'medium' },
                    { label: 'Large (52px)', value: 'large' },
                ],
                defaultValue: 'medium',
            },
            {
                id: 'label',
                label: 'Field Label',
                description: 'Label displayed above input',
                type: 'text',
                section: 'Content',
                defaultValue: 'Email Address',
            },
            {
                id: 'placeholder',
                label: 'Placeholder Text',
                description: 'Hint text inside empty field',
                type: 'text',
                section: 'Content',
                defaultValue: 'alex.design@apple.com',
            },
            {
                id: 'validationState',
                label: 'Validation Feedback',
                description: 'Interactive error or success state',
                type: 'select',
                section: 'Validation',
                options: [
                    { label: 'Normal (None)', value: 'none' },
                    { label: 'Error (Invalid Email)', value: 'error' },
                    { label: 'Success (Verified)', value: 'success' },
                ],
                defaultValue: 'none',
            },
            {
                id: 'clearable',
                label: 'Clear Button (X)',
                description: 'One-click erase icon when typed',
                type: 'switch',
                section: 'Behavior',
                defaultValue: true,
            },
            {
                id: 'autoPassword',
                label: 'Password Eye Toggle',
                description: 'Show eye toggle button',
                type: 'switch',
                section: 'Behavior',
                defaultValue: false,
            },
        ],
        defaultProps: {
            variant: 'outlined',
            size: 'medium',
            label: 'Email Address',
            placeholder: 'alex.design@apple.com',
            validationState: 'none',
            clearable: true,
            autoPassword: false,
        },
        generateCode: (props) => `import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomInput from './components/CustomInput';

export default function InputDemo() {
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <CustomInput
        label="${props.label || 'Email Address'}"
        placeholder="${props.placeholder || 'alex.design@apple.com'}"
        variant="${props.variant || 'outlined'}"
        size="${props.size || 'medium'}"
        value={email}
        onChangeText={setEmail}
        clearable={${props.clearable ? 'true' : 'false'}}
        autoPassword={${props.autoPassword ? 'true' : 'false'}}
        ${props.validationState === 'error' ? 'error="Please enter a valid email address"' : ''}
        ${props.validationState === 'success' ? 'success="Email verified and available"' : ''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'center',
  },
});`,
    },

    // ─── 6. Date Picker ──────────────────────────────────────────────────────────
    {
        id: 'date-picker',
        name: 'Animated Date Picker',
        category: 'Inputs',
        typeSubtitle: 'Input · 3-Mode Calendar',
        color: '#10B981',
        icon: '📅',
        description: 'Expandable calendar supporting Day, Month, and Year modes with smooth spring transitions.',
        snackId: '@mr.mukesh/date-picker',
        controls: [
            {
                id: 'pickerMode',
                label: 'Calendar View Mode',
                description: 'Switch between Day, Month, and Year grids',
                type: 'select',
                section: 'Mode',
                options: [
                    { label: 'Day Selection (Grid 1-31)', value: 'date' },
                    { label: 'Month Selector (12 Months)', value: 'month' },
                    { label: 'Year Selector (12 Years)', value: 'year' },
                ],
                defaultValue: 'date',
            },
            {
                id: 'primaryColor',
                label: 'Selected Date Pill',
                description: 'Color of highlighted calendar day',
                type: 'color',
                section: 'Colors',
                palette: ['#09090B', '#0A84FF', '#10B981', '#EC4899', '#8B5CF6'],
                defaultValue: '#09090B',
            },
            {
                id: 'label',
                label: 'Field Label',
                description: 'Header text displayed above picker',
                type: 'text',
                section: 'Content',
                defaultValue: 'Date of Birth',
            },
            {
                id: 'placeholder',
                label: 'Placeholder Text',
                description: 'Text before date selection',
                type: 'text',
                section: 'Content',
                defaultValue: 'Select Appointment Date',
            },
        ],
        defaultProps: {
            pickerMode: 'date',
            primaryColor: '#09090B',
            label: 'Date of Birth',
            placeholder: 'Select Appointment Date',
        },
        generateCode: (props) => `import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DatePicker from './components/DatePicker';

export default function DatePickerDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <View style={styles.container}>
      <DatePicker
        label="${props.label || 'Date of Birth'}"
        placeholder="${props.placeholder || 'Select Appointment Date'}"
        value={date}
        onDateChange={setDate}
        colors={{ primary: "${props.primaryColor || '#09090B'}" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 20,
    justifyContent: 'center',
  },
});`,
    },

    // ─── 7. Dynamic OTP ──────────────────────────────────────────────────────────
    {
        id: 'dynamic-otp',
        name: 'Dynamic OTP Morph',
        category: 'Inputs',
        typeSubtitle: 'Input · Morphing Digits',
        color: '#10B981',
        icon: '🔢',
        description: 'Digit verification boxes dynamically morphing into a spinning diamond loader, error shake, or checkmark.',
        snackId: '@mr.mukesh/dynamic-otp',
        controls: [
            {
                id: 'status',
                label: 'Morphing Status State',
                description: 'Trigger dynamic shape morphing transitions',
                type: 'select',
                section: 'State',
                options: [
                    { label: 'Idle (4 Digit Input Boxes)', value: 'idle' },
                    { label: 'Loading (Spinning Diamond Morph)', value: 'loading' },
                    { label: 'Success (Merged Center Checkmark)', value: 'success' },
                    { label: 'Error (Horizontal Shake)', value: 'error' },
                ],
                defaultValue: 'idle',
            },
            {
                id: 'focusColor',
                label: 'Active Box Focus Tint',
                description: 'Border and glow color of active digit box',
                type: 'color',
                section: 'Appearance',
                palette: ['#0A84FF', '#10B981', '#FF0080', '#F59E0B', '#18181B'],
                defaultValue: '#0A84FF',
            },
        ],
        defaultProps: {
            status: 'idle',
            focusColor: '#0A84FF',
        },
        generateCode: (props) => `import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { DynamicOtp, OtpStatus } from './components/DynamicOtp';

export default function OtpDemo() {
  const [status, setStatus] = useState<OtpStatus>('${props.status || 'idle'}');

  return (
    <View style={styles.container}>
      <DynamicOtp
        status={status}
        onComplete={(code) => {
          setStatus('loading');
          setTimeout(() => setStatus('success'), 1800);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    justifyContent: 'center',
    alignItems: 'center',
  },
});`,
    },

    // ─── 8. Dynamic Upload Card ──────────────────────────────────────────────────
    {
        id: 'dynamic-upload',
        name: 'Dynamic Upload Card',
        category: 'Feedback',
        typeSubtitle: 'Feedback · Progress Micro-anim',
        color: '#818CF8',
        icon: '☁️',
        description: 'Animated file upload status card with green XLSX badge, animated progress bar, pause/resume, and delete states.',
        snackId: '@mr.mukesh/dynamic-upload',
        controls: [
            {
                id: 'status',
                label: 'Upload Workflow State',
                description: 'Active state of upload bar and action buttons',
                type: 'select',
                section: 'State',
                options: [
                    { label: 'Uploading (Purple Fill + Pause/Cancel)', value: 'uploading' },
                    { label: 'Paused (Dark Grey Fill + Play)', value: 'paused' },
                    { label: 'Success (Green Fill + Delete Trash)', value: 'success' },
                ],
                defaultValue: 'uploading',
            },
            {
                id: 'progress',
                label: 'Simulated Progress',
                description: 'Completion percentage',
                type: 'slider',
                min: 0,
                max: 100,
                step: 5,
                unit: '%',
                section: 'State',
                defaultValue: 68,
            },
            {
                id: 'fileName',
                label: 'File Name',
                description: 'File title displayed on card',
                type: 'text',
                section: 'Content',
                defaultValue: 'create-ui.xlsx',
            },
            {
                id: 'fileSize',
                label: 'File Size Display',
                description: 'Size indicator',
                type: 'text',
                section: 'Content',
                defaultValue: '2.3MB',
            },
        ],
        defaultProps: {
            status: 'uploading',
            progress: 68,
            fileName: 'create-ui.xlsx',
            fileSize: '2.3MB',
        },
        generateCode: (props) => `import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DynamicUpload } from './components/DynamicUpload';

export default function UploadDemo() {
  return (
    <View style={styles.container}>
      <DynamicUpload
        fileName="${props.fileName || 'create-ui.xlsx'}"
        fileSize="${props.fileSize || '2.3MB'}"
        totalSize="${props.fileSize || '2.3MB'}"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24,
    justifyContent: 'center',
  },
});`,
    },

    // ─── 9. Expandable Action Menu ───────────────────────────────────────────────
    {
        id: 'expandable-action-menu',
        name: 'Expandable Action Menu',
        category: 'Navigation',
        typeSubtitle: 'Navigation · Expanding Bottom Bar',
        color: '#38BDF8',
        icon: '⚡',
        description: 'Bottom tab bar whose center FAB expands upward into a 3-row action menu with rotating plus and spring physics.',
        snackId: '@mr.mukesh/expandable-action-menu',
        controls: [
            {
                id: 'isExpanded',
                label: 'Expand Action Menu',
                description: 'Toggle expanded 3-row menu preview',
                type: 'switch',
                section: 'State',
                defaultValue: false,
            },
            {
                id: 'activeTab',
                label: 'Active Bottom Tab',
                description: 'Selected primary route in collapsed bar',
                type: 'select',
                section: 'Navigation',
                options: [
                    { label: 'Home Tab', value: 'home' },
                    { label: 'Search Tab', value: 'search' },
                    { label: 'Alerts Tab', value: 'notifications' },
                    { label: 'Profile Tab', value: 'profile' },
                ],
                defaultValue: 'home',
            },
            {
                id: 'accentColor',
                label: 'Active Accent Color',
                description: 'FAB and highlight tint',
                type: 'color',
                section: 'Colors',
                palette: ['#18181B', '#0A84FF', '#10B981', '#EC4899'],
                defaultValue: '#18181B',
            },
        ],
        defaultProps: {
            isExpanded: false,
            activeTab: 'home',
            accentColor: '#18181B',
        },
        generateCode: () => `import React from 'react';
import { View, StyleSheet } from 'react-native';
import ExpandableActionMenu from './components/ExpandableActionMenu';

export default function ActionMenuDemo() {
  return (
    <View style={styles.container}>
      <ExpandableActionMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
    justifyContent: 'flex-end',
  },
});`,
    },

    // ─── 10. Expandable Card ─────────────────────────────────────────────────────
    {
        id: 'expandable-card',
        name: 'Expandable Shared Card',
        category: 'Display',
        typeSubtitle: 'Display · App Store Shared Layout',
        color: '#F59E0B',
        icon: '🎴',
        description: 'App Store style feed card expanding with shared layout spring physics into a full-screen scrollable story.',
        snackId: '@mr.mukesh/expandable-card',
        controls: [
            {
                id: 'cardTitle',
                label: 'Featured Card Title',
                description: 'Main editorial headline',
                type: 'text',
                section: 'Content',
                defaultValue: 'Design Systems 2026',
            },
            {
                id: 'category',
                label: 'Overline Category',
                description: 'Small uppercase overline text',
                type: 'text',
                section: 'Content',
                defaultValue: 'FEATURED STORY',
            },
            {
                id: 'cornerRadius',
                label: 'Card Corner Curvature',
                description: 'Base corner radius',
                type: 'slider',
                min: 12,
                max: 28,
                step: 2,
                unit: 'pt',
                section: 'Appearance',
                defaultValue: 20,
            },
        ],
        defaultProps: {
            cardTitle: 'Design Systems 2026',
            category: 'FEATURED STORY',
            cornerRadius: 20,
        },
        generateCode: (props) => `import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExpandableCardList } from './components/ExpandableCard';

const CARDS = [
  {
    id: '1',
    category: '${props.category || 'FEATURED STORY'}',
    title: '${props.cardTitle || 'Design Systems 2026'}',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    content: 'Fluid micro-animations with shared layout transitions create a tactile native feel.',
  },
];

export default function CardDemo() {
  return (
    <View style={styles.container}>
      <ExpandableCardList data={CARDS} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    padding: 16,
  },
});`,
    },

    // ─── 11. Floating Speed Dial ─────────────────────────────────────────────────
    {
        id: 'floating-speed-dial',
        name: 'Floating Speed Dial',
        category: 'Buttons',
        typeSubtitle: 'Button · Gradient FAB Stack',
        color: '#EC4899',
        icon: '🚀',
        description: 'Linear gradient floating action button expanding into a vertical stack of sub-actions with rotation and labels.',
        snackId: '@mr.mukesh/floating-speed-dial',
        controls: [
            {
                id: 'isOpen',
                label: 'Expanded Sub-Actions',
                description: 'Toggle vertical action list preview',
                type: 'switch',
                section: 'Behavior',
                defaultValue: false,
            },
            {
                id: 'gradientPreset',
                label: 'FAB Gradient Palette',
                description: 'Color pair for primary floating button',
                type: 'select',
                section: 'Colors',
                options: [
                    { label: 'Pink to Orange (#FF0080 → #FF6347)', value: 'pink-orange' },
                    { label: 'Purple to Blue (#8B5CF6 → #3B82F6)', value: 'purple-blue' },
                    { label: 'Emerald to Cyan (#10B981 → #06B6D4)', value: 'emerald-cyan' },
                    { label: 'Dark Titanium (#27272A → #09090B)', value: 'black-zinc' },
                ],
                defaultValue: 'pink-orange',
            },
        ],
        defaultProps: {
            isOpen: false,
            gradientPreset: 'pink-orange',
        },
        generateCode: (props) => `import React from 'react';
import { View, StyleSheet } from 'react-native';
import FloatingSpeedDial from './components/FloatingSpeedDial';

export default function SpeedDialDemo() {
  return (
    <View style={styles.container}>
      <FloatingSpeedDial
        onAddFriends={() => console.log('Add friends')}
        onAddDocument={() => console.log('Add document')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
});`,
    },

    // ─── 12. Gradient Button ─────────────────────────────────────────────────────
    {
        id: 'gradient-button',
        name: 'Gradient Button',
        category: 'Buttons',
        typeSubtitle: 'Button · LinearGradient Variants',
        color: '#EC4899',
        icon: '🎨',
        description: 'LinearGradient button supporting primary, secondary, outline, and ghost variants, plus loading spinners.',
        snackId: '@mr.mukesh/gradient-button',
        controls: [
            {
                id: 'variant',
                label: 'Button Variant',
                description: 'Visual appearance variant',
                type: 'select',
                section: 'Style',
                options: [
                    { label: 'Primary (Linear Gradient)', value: 'primary' },
                    { label: 'Secondary (Solid Dark)', value: 'secondary' },
                    { label: 'Outline (Border)', value: 'outline' },
                    { label: 'Ghost (Transparent)', value: 'ghost' },
                ],
                defaultValue: 'primary',
            },
            {
                id: 'size',
                label: 'Button Size',
                description: 'Padding and font scale',
                type: 'select',
                section: 'Style',
                options: [
                    { label: 'Small', value: 'small' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Large', value: 'large' },
                ],
                defaultValue: 'medium',
            },
            {
                id: 'title',
                label: 'Button Title',
                description: 'Center typography',
                type: 'text',
                section: 'Content',
                defaultValue: 'Get Started Today',
            },
            {
                id: 'gradientPreset',
                label: 'Gradient Color Pair',
                description: 'Colors for primary variant',
                type: 'select',
                section: 'Appearance',
                options: [
                    { label: 'Sunset Red/Orange (#FF5F6D → #FFC371)', value: 'sunset' },
                    { label: 'Purple to Pink (#8B5CF6 → #EC4899)', value: 'purple-pink' },
                    { label: 'Ocean Blue (#0284C7 → #38BDF8)', value: 'ocean-blue' },
                    { label: 'Emerald (#059669 → #10B981)', value: 'emerald' },
                ],
                defaultValue: 'sunset',
            },
            {
                id: 'loading',
                label: 'Loading Spinner State',
                description: 'Show native ActivityIndicator',
                type: 'switch',
                section: 'State',
                defaultValue: false,
            },
            {
                id: 'disabled',
                label: 'Disabled State',
                description: 'Disable tap interactions',
                type: 'switch',
                section: 'State',
                defaultValue: false,
            },
            {
                id: 'borderRadius',
                label: 'Corner Curvature',
                description: 'Pill roundness',
                type: 'slider',
                min: 8,
                max: 28,
                step: 2,
                unit: 'pt',
                section: 'Layout',
                defaultValue: 16,
            },
        ],
        defaultProps: {
            variant: 'primary',
            size: 'medium',
            title: 'Get Started Today',
            gradientPreset: 'sunset',
            loading: false,
            disabled: false,
            borderRadius: 16,
        },
        generateCode: (props) => {
            const colorsMap: Record<string, string> = {
                sunset: "['#FF5F6D', '#FFC371']",
                'purple-pink': "['#8B5CF6', '#EC4899']",
                'ocean-blue': "['#0284C7', '#38BDF8']",
                emerald: "['#059669', '#10B981']",
            };
            return `import React from 'react';
import { View, StyleSheet } from 'react-native';
import GradientButton from './components/GradientButton';

export default function ButtonDemo() {
  return (
    <View style={styles.container}>
      <GradientButton
        title="${props.title || 'Get Started Today'}"
        variant="${props.variant || 'primary'}"
        size="${props.size || 'medium'}"
        gradientColors={${colorsMap[props.gradientPreset] || colorsMap.sunset}}
        borderRadius={${props.borderRadius || 16}}
        loading={${props.loading ? 'true' : 'false'}}
        disabled={${props.disabled ? 'true' : 'false'}}
        onPress={() => console.log('Tapped')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});`;
        },
    },

    // ─── 13. Image Carousel ──────────────────────────────────────────────────────
    {
        id: 'image-carousel',
        name: '3D Image Carousel',
        category: 'Display',
        typeSubtitle: 'Display · 3D Depth & Stack',
        color: '#F59E0B',
        icon: '🖼️',
        description: 'Interactive carousel supporting Depth 3D rotation, Stack cards, and Perspective layouts with auto-play.',
        snackId: '@mr.mukesh/image-carousel',
        controls: [
            {
                id: 'layout',
                label: 'Carousel 3D Layout',
                description: 'Exact 3D projection physics from registry',
                type: 'select',
                section: 'Physics',
                options: [
                    { label: 'Depth (3D Rotated Cards)', value: 'depth' },
                    { label: 'Stack (Overlapping Layered)', value: 'stack' },
                    { label: 'Perspective (3D Tilt)', value: 'perspective' },
                ],
                defaultValue: 'depth',
            },
            {
                id: 'orientation',
                label: 'Scroll Orientation',
                description: 'Horizontal or vertical card paging',
                type: 'select',
                section: 'Layout',
                options: [
                    { label: 'Horizontal Paging', value: 'horizontal' },
                    { label: 'Vertical Paging', value: 'vertical' },
                ],
                defaultValue: 'horizontal',
            },
            {
                id: 'autoPlay',
                label: 'Auto Play Paging',
                description: 'Advance cards periodically',
                type: 'switch',
                section: 'Behavior',
                defaultValue: true,
            },
            {
                id: 'autoPlayInterval',
                label: 'Slide Duration',
                description: 'Seconds per card transition',
                type: 'slider',
                min: 2,
                max: 8,
                step: 0.5,
                unit: 's',
                section: 'Behavior',
                defaultValue: 3.5,
            },
            {
                id: 'showPagination',
                label: 'Show Pagination Dots',
                description: 'Bottom indicator dot pills',
                type: 'switch',
                section: 'Appearance',
                defaultValue: true,
            },
        ],
        defaultProps: {
            layout: 'depth',
            orientation: 'horizontal',
            autoPlay: true,
            autoPlayInterval: 3.5,
            showPagination: true,
        },
        generateCode: (props) => `import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ImageCarousel, { CarouselItem } from './components/ImageCarousel';

const IMAGES: CarouselItem[] = [
  { id: '1', image: { uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600' }, title: 'Yosemite Valley', subtitle: 'California, USA' },
  { id: '2', image: { uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600' }, title: 'Alpine Peaks', subtitle: 'Chamonix, France' },
  { id: '3', image: { uri: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600' }, title: 'Misty Valley', subtitle: 'Vancouver, Canada' },
];

export default function CarouselDemo() {
  return (
    <View style={styles.container}>
      <ImageCarousel
        data={IMAGES}
        layout="${props.layout || 'depth'}"
        orientation="${props.orientation || 'horizontal'}"
        autoPlay={${props.autoPlay ? 'true' : 'false'}}
        autoPlayInterval={${(props.autoPlayInterval || 3.5) * 1000}}
        showPagination={${props.showPagination ? 'true' : 'false'}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
    justifyContent: 'center',
  },
});`,
    },

    // ─── 14. Image Skeleton Skia ─────────────────────────────────────────────────
    {
        id: 'image-skeleton',
        name: 'Skia Image Skeleton',
        category: 'Loading',
        typeSubtitle: 'Loading · Orbiting Skia Spotlight',
        color: '#6366F1',
        icon: '🌅',
        description: 'Shopify Skia powered dual orbiting radial spotlight sweeping across a high-precision dot-matrix grid.',
        snackId: '@mr.mukesh/image-skeleton',
        controls: [
            {
                id: 'duration',
                label: 'Orbit Duration Speed',
                description: 'Full 360° circular sweep time in seconds',
                type: 'slider',
                min: 2,
                max: 6,
                step: 0.5,
                unit: 's',
                section: 'Animation',
                defaultValue: 4,
            },
            {
                id: 'baseColor',
                label: 'Base Background Color',
                description: 'Dark canvas surface tone',
                type: 'color',
                section: 'Colors',
                palette: ['#171717', '#09090B', '#1E1E24', '#0F172A'],
                defaultValue: '#171717',
            },
            {
                id: 'accentColor',
                label: 'Spotlight Beam Tint',
                description: 'Sweeping radial highlight color',
                type: 'color',
                section: 'Colors',
                palette: ['#FFFFFF', '#38BDF8', '#818CF8', '#10B981', '#F59E0B'],
                defaultValue: '#FFFFFF',
            },
            {
                id: 'borderRadius',
                label: 'Frame Corner Curvature',
                description: 'Corner radius of skeleton frame',
                type: 'slider',
                min: 8,
                max: 24,
                step: 2,
                unit: 'pt',
                section: 'Layout',
                defaultValue: 16,
            },
        ],
        defaultProps: {
            duration: 4,
            baseColor: '#171717',
            accentColor: '#FFFFFF',
            borderRadius: 16,
        },
        generateCode: (props) => `import React from 'react';
import { View, StyleSheet } from 'react-native';
import ImageSkeleton from './components/ImageSkeleton';

export default function ImageSkeletonDemo() {
  return (
    <View style={styles.container}>
      <ImageSkeleton
        width={300}
        height={200}
        borderRadius={${props.borderRadius || 16}}
        baseColor="${props.baseColor || '#171717'}"
        accentColor="${props.accentColor || '#FFFFFF'}"
        duration={${(props.duration || 4) * 1000}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});`,
    },

    // ─── 15. Liquid Action Tab Bar ───────────────────────────────────────────────
    {
        id: 'liquid-action-tab-bar',
        name: 'Liquid Action Tab Bar',
        category: 'Navigation',
        typeSubtitle: 'Navigation · Concave Notch & Tool Grid',
        color: '#38BDF8',
        icon: '💧',
        description: 'Concave dynamic notch tab bar whose elevated FAB morphs into an 11-tool creative action grid.',
        snackId: '@mr.mukesh/liquid-action-tab-bar',
        controls: [
            {
                id: 'isExpanded',
                label: 'Expand Action Grid',
                description: 'Morph bottom bar into 11-tool creative grid',
                type: 'switch',
                section: 'State',
                defaultValue: false,
            },
            {
                id: 'activeTab',
                label: 'Active Bottom Tab',
                description: 'Selected primary route in collapsed bar',
                type: 'select',
                section: 'Navigation',
                options: [
                    { label: 'Home Tab', value: 'home' },
                    { label: 'Vault Tab', value: 'inbox' },
                    { label: 'Alerts Tab', value: 'notifications' },
                    { label: 'Feed Tab', value: 'layers' },
                ],
                defaultValue: 'home',
            },
            {
                id: 'accentColor',
                label: 'FAB Accent Color',
                description: 'Elevated circle button background',
                type: 'color',
                section: 'Colors',
                palette: ['#0A84FF', '#EC4899', '#10B981', '#F59E0B', '#18181B'],
                defaultValue: '#0A84FF',
            },
        ],
        defaultProps: {
            isExpanded: false,
            activeTab: 'home',
            accentColor: '#0A84FF',
        },
        generateCode: (props) => `import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LiquidActionTabBar from './components/LiquidActionTabBar';

export default function TabBarDemo() {
  const [activeTab, setActiveTab] = useState('${props.activeTab || 'home'}');

  return (
    <View style={styles.container}>
      <LiquidActionTabBar
        activeTabId={activeTab}
        onTabChange={setActiveTab}
        accentColor="${props.accentColor || '#0A84FF'}"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    justifyContent: 'flex-end',
  },
});`,
    },

    // ─── 16. Native Haptics ──────────────────────────────────────────────────────
    {
        id: 'native-haptics',
        name: 'Native Haptic Engine',
        category: 'Feedback',
        typeSubtitle: 'Feedback · Tactile Engine',
        color: '#818CF8',
        icon: '📳',
        description: 'Trigger subtle native impact, notification, and selection haptic feedbacks with simulated physics vibrations.',
        snackId: '@mr.mukesh/native-haptics',
        controls: [
            {
                id: 'feedbackType',
                label: 'Haptic Frequency Profile',
                description: 'Tactile curve and motor pattern',
                type: 'select',
                section: 'Pattern',
                options: [
                    { label: 'Selection (Light Tick)', value: 'selection' },
                    { label: 'Impact Soft / Light', value: 'light' },
                    { label: 'Impact Medium', value: 'medium' },
                    { label: 'Impact Heavy (Solid Thump)', value: 'heavy' },
                    { label: 'Notification Success (Double Pulse)', value: 'success' },
                    { label: 'Notification Error (Triple Buzz)', value: 'error' },
                ],
                defaultValue: 'selection',
            },
        ],
        defaultProps: {
            feedbackType: 'selection',
        },
        generateCode: (props) => `import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import {
  triggerHaptic,
  triggerSelectionHaptic,
  triggerMediumHaptic,
  triggerSuccessHaptic,
  triggerErrorHaptic,
} from './components/NativeHaptics';

export default function HapticsDemo() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          ${
            props.feedbackType === 'success'
              ? 'triggerSuccessHaptic();'
              : props.feedbackType === 'error'
              ? 'triggerErrorHaptic();'
              : props.feedbackType === 'medium'
              ? 'triggerMediumHaptic();'
              : props.feedbackType === 'selection'
              ? 'triggerSelectionHaptic();'
              : 'triggerHaptic();'
          }
        }}
      >
        <Text style={styles.btnText}>Trigger ${props.feedbackType || 'Selection'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#111827',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});`,
    },

    // ─── 17. 3D Photo Album ──────────────────────────────────────────────────────
    {
        id: 'photo-album',
        name: '3D Hardcover Album',
        category: 'Display',
        typeSubtitle: 'Display · 12-Strip Page Curl',
        color: '#F59E0B',
        icon: '📖',
        description: 'Hardcover 3D book spread with 12 progressive bending strips creating realistic cylindrical page turning.',
        snackId: '@mr.mukesh/3d-photo-album',
        controls: [
            {
                id: 'spread',
                label: 'Turn to Spread',
                description: 'Open book to specific spread or closed cover',
                type: 'select',
                section: 'Reading',
                options: [
                    { label: 'Cover (Closed)', value: '0' },
                    { label: 'Spread 1 (Plates 01 & 02)', value: '1' },
                    { label: 'Spread 2 (Plate 03 & Back)', value: '2' },
                ],
                defaultValue: '0',
            },
            {
                id: 'coverColor',
                label: 'Cover Material Color',
                description: 'Hardcover linen tone',
                type: 'color',
                section: 'Appearance',
                palette: ['#CFC7BB', '#18181B', '#8B5CF6', '#1E3A8A', '#064E3B'],
                defaultValue: '#CFC7BB',
            },
            {
                id: 'albumTitle',
                label: 'Gold Debossed Title',
                description: 'Cover typography',
                type: 'text',
                section: 'Content',
                defaultValue: 'HOWARD BEACH',
            },
        ],
        defaultProps: {
            spread: '0',
            coverColor: '#CFC7BB',
            albumTitle: 'HOWARD BEACH',
        },
        generateCode: (props) => `import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import PhotoAlbum from './components/PhotoAlbum';

export default function AlbumDemo() {
  return (
    <View style={styles.container}>
      <PhotoAlbum
        pages={[
          <View style={styles.cover}>
            <Text style={styles.title}>${props.albumTitle || 'HOWARD BEACH'}</Text>
          </View>,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cover: {
    flex: 1,
    backgroundColor: '${props.coverColor || '#CFC7BB'}',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 2,
  },
});`,
    },

    // ─── 18. Rainbow Button ──────────────────────────────────────────────────────
    {
        id: 'rainbow-button',
        name: 'Rainbow Laser Button',
        category: 'Buttons',
        typeSubtitle: 'Button · SVG Perimeter Tracer',
        color: '#EC4899',
        icon: '🌈',
        description: 'Smooth SVG linear gradient loop traced continuously around the perimeter path of a rounded button.',
        snackId: '@mr.mukesh/rainbow-button',
        controls: [
            {
                id: 'buttonText',
                label: 'Button Label',
                description: 'Center typography',
                type: 'text',
                section: 'Content',
                defaultValue: 'Get Unlimited Access',
            },
            {
                id: 'speed',
                label: 'Laser Trace Speed',
                description: 'Duration for one perimeter lap in seconds',
                type: 'slider',
                min: 1,
                max: 6,
                step: 0.5,
                unit: 's',
                section: 'Animation',
                defaultValue: 3,
            },
            {
                id: 'borderRadius',
                label: 'Corner Curvature',
                description: 'Curvature of rounded rectangle border',
                type: 'slider',
                min: 8,
                max: 28,
                step: 2,
                unit: 'pt',
                section: 'Layout',
                defaultValue: 16,
            },
            {
                id: 'borderWidth',
                label: 'Laser Border Width',
                description: 'Thickness of animated stroke',
                type: 'slider',
                min: 1,
                max: 5,
                step: 1,
                unit: 'px',
                section: 'Layout',
                defaultValue: 2,
            },
        ],
        defaultProps: {
            buttonText: 'Get Unlimited Access',
            speed: 3,
            borderRadius: 16,
            borderWidth: 2,
        },
        generateCode: (props) => `import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import RainbowButton from './components/RainbowButton';

export default function RainbowDemo() {
  return (
    <View style={styles.container}>
      <RainbowButton
        width={240}
        height={54}
        borderRadius={${props.borderRadius || 16}}
        borderWidth={${props.borderWidth || 2}}
        onPress={() => console.log('Rainbow pressed')}
      >
        <Text style={styles.text}>${props.buttonText || 'Get Unlimited Access'}</Text>
      </RainbowButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});`,
    },

    // ─── 19. Range Slider ────────────────────────────────────────────────────────
    {
        id: 'range-slider',
        name: 'Continuous Range Slider',
        category: 'Inputs',
        typeSubtitle: 'Input · PanResponder Slider',
        color: '#10B981',
        icon: '🎚️',
        description: 'Smooth draggable pan-responder slider with real-time value percentage, track fill, and thumb spring snap.',
        snackId: '@mr.mukesh/range-slider',
        controls: [
            {
                id: 'value',
                label: 'Slider Value',
                description: 'Current percentage value',
                type: 'slider',
                min: 0,
                max: 100,
                step: 1,
                unit: '%',
                section: 'State',
                defaultValue: 65,
            },
            {
                id: 'min',
                label: 'Minimum Bound',
                description: 'Lower limit',
                type: 'slider',
                min: 0,
                max: 50,
                step: 5,
                unit: '',
                section: 'Range Limits',
                defaultValue: 0,
            },
            {
                id: 'max',
                label: 'Maximum Bound',
                description: 'Upper limit',
                type: 'slider',
                min: 50,
                max: 200,
                step: 10,
                unit: '',
                section: 'Range Limits',
                defaultValue: 100,
            },
            {
                id: 'step',
                label: 'Step Increment',
                description: 'Snap increment interval',
                type: 'select',
                section: 'Range Limits',
                options: [
                    { label: 'Step 1 (Fluid Continuous)', value: '1' },
                    { label: 'Step 5 (Stepped)', value: '5' },
                    { label: 'Step 10 (Deciles)', value: '10' },
                ],
                defaultValue: '1',
            },
            {
                id: 'activeTrackColor',
                label: 'Active Track Tint',
                description: 'Highlighted progress fill bar color',
                type: 'color',
                section: 'Appearance',
                palette: ['#FF0080', '#0A84FF', '#10B981', '#111827'],
                defaultValue: '#FF0080',
            },
        ],
        defaultProps: {
            value: 65,
            min: 0,
            max: 100,
            step: '1',
            activeTrackColor: '#FF0080',
        },
        generateCode: (props) => `import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import RangeSlider from './components/RangeSlider';

export default function SliderDemo() {
  const [val, setVal] = useState(${props.value || 65});

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Output: {val}%</Text>
      <RangeSlider
        value={val}
        onValueChange={setVal}
        min={${props.min || 0}}
        max={${props.max || 100}}
        step={${props.step || 1}}
        activeTrackColor="${props.activeTrackColor || '#FF0080'}"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    padding: 24,
    justifyContent: 'center',
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});`,
    },

    // ─── 20. Skeleton Loader ─────────────────────────────────────────────────────
    {
        id: 'skeleton-loader',
        name: 'Skeleton Loader Variants',
        category: 'Loading',
        typeSubtitle: 'Loading · LinearGradient Shimmer',
        color: '#6366F1',
        icon: '💀',
        description: 'LinearGradient animated shimmer wave loader with pre-built SkeletonCard and SkeletonList patterns.',
        snackId: '@mr.mukesh/skeleton-loader',
        controls: [
            {
                id: 'variant',
                label: 'Pre-built Pattern Variant',
                description: 'Pre-built composite skeleton layout',
                type: 'select',
                section: 'Layout',
                options: [
                    { label: 'Card Variant (Media + Content)', value: 'card' },
                    { label: 'List Variant (Avatar Circles + Lines)', value: 'list' },
                ],
                defaultValue: 'card',
            },
            {
                id: 'duration',
                label: 'Shimmer Wave Speed',
                description: 'Wave frequency speed in seconds',
                type: 'slider',
                min: 0.8,
                max: 3,
                step: 0.2,
                unit: 's',
                section: 'Animation',
                defaultValue: 1.5,
            },
            {
                id: 'borderRadius',
                label: 'Bone Radius',
                description: 'Curvature of skeleton frames',
                type: 'slider',
                min: 4,
                max: 20,
                step: 2,
                unit: 'pt',
                section: 'Appearance',
                defaultValue: 8,
            },
        ],
        defaultProps: {
            variant: 'card',
            duration: 1.5,
            borderRadius: 8,
        },
        generateCode: (props) => `import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader, { SkeletonCard, SkeletonList } from './components/SkeletonLoader';

export default function SkeletonDemo() {
  return (
    <View style={styles.container}>
      ${props.variant === 'list' ? '<SkeletonList count={3} />' : '<SkeletonCard />'}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'center',
  },
});`,
    },

    // ─── 21. Switch Toggle ───────────────────────────────────────────────────────
    {
        id: 'switch-toggle',
        name: 'Native Switch Toggle',
        category: 'Inputs',
        typeSubtitle: 'Input · Spring Toggle',
        color: '#10B981',
        icon: '🔘',
        description: 'Native-style toggle switch with spring physics, custom track colors, thumb colors, and labels.',
        snackId: '@mr.mukesh/switch-toggle',
        controls: [
            {
                id: 'label',
                label: 'Toggle Label Text',
                description: 'Header text beside switch',
                type: 'text',
                section: 'Content',
                defaultValue: 'Airplane Mode',
            },
            {
                id: 'state',
                label: 'Toggle State (On/Off)',
                description: 'Current boolean value',
                type: 'switch',
                section: 'State',
                defaultValue: true,
            },
            {
                id: 'onColor',
                label: 'Active Track Tone',
                description: 'Color when toggled ON (default darkgray #374151)',
                type: 'color',
                section: 'Colors',
                palette: ['#374151', '#10B981', '#0A84FF', '#FF0080'],
                defaultValue: '#374151',
            },
            {
                id: 'disabled',
                label: 'Disabled State',
                description: 'Disable user interaction',
                type: 'switch',
                section: 'State',
                defaultValue: false,
            },
        ],
        defaultProps: {
            label: 'Airplane Mode',
            state: true,
            onColor: '#374151',
            disabled: false,
        },
        generateCode: (props) => `import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SwitchToggle from './components/SwitchToggle';

export default function ToggleDemo() {
  const [enabled, setEnabled] = useState(${props.state ? 'true' : 'false'});

  return (
    <View style={styles.container}>
      <SwitchToggle
        label="${props.label || 'Airplane Mode'}"
        value={enabled}
        onValueChange={setEnabled}
        onColor="${props.onColor || '#374151'}"
        disabled={${props.disabled ? 'true' : 'false'}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'center',
  },
});`,
    },

    // ─── 22. Time Picker ─────────────────────────────────────────────────────────
    {
        id: 'time-picker',
        name: 'Animated Time Picker',
        category: 'Inputs',
        typeSubtitle: 'Input · Analog Dial & Snap List',
        color: '#10B981',
        icon: '⏰',
        description: 'Scroll-driven animated analog clock face synchronized continuously with snapping 30-minute time slots.',
        snackId: '@mr.mukesh/time-picker',
        controls: [
            {
                id: 'theme',
                label: 'Card Theme',
                description: 'iOS Dark Mode or Light Mode card styling',
                type: 'select',
                section: 'Appearance',
                options: [
                    { label: 'Dark Mode (#1C1C1E)', value: 'dark' },
                    { label: 'Light Mode (#FFFFFF)', value: 'light' },
                ],
                defaultValue: 'dark',
            },
            {
                id: 'mode',
                label: 'Selection Mode',
                description: 'Choose single time or start/end time range',
                type: 'select',
                section: 'Mode',
                options: [
                    { label: 'Single Time Selection', value: 'single' },
                    { label: 'Time Range (Start → End)', value: 'range' },
                ],
                defaultValue: 'single',
            },
            {
                id: 'accentColor',
                label: 'Clock Hand Accent',
                description: 'Minute hand & indicator accent color',
                type: 'color',
                section: 'Colors',
                palette: ['#0A84FF', '#10B981', '#FF0080', '#F59E0B'],
                defaultValue: '#0A84FF',
            },
        ],
        defaultProps: {
            theme: 'dark',
            mode: 'single',
            accentColor: '#0A84FF',
        },
        generateCode: () => `import React from 'react';
import { View, StyleSheet } from 'react-native';
import TimePicker from './components/TimePicker';

export default function TimePickerDemo() {
  return (
    <View style={styles.container}>
      <TimePicker
        initialIndex={38}
        onTimeChange={(start, end) => console.log('Selected:', start, end)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
});`,
    },
];
