import { ComponentDefinition } from './types';

// ─── Helper ──────────────────────────────────────────────────────────────────

function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Shared JSX Generator for all CustomInput variants ───────────────────────

function generateCustomInputJSX(props: Record<string, any>, stateVar: string): string {
    const lines: string[] = [`      <CustomInput`];
    if (props.label) lines.push(`        label="${props.label}"`);
    if (props.placeholder) lines.push(`        placeholder="${props.placeholder}"`);
    lines.push(`        value={${stateVar}}`);
    lines.push(`        onChangeText={set${capitalize(stateVar)}}`);
    if (props.variant && props.variant !== 'default') lines.push(`        variant="${props.variant}"`);
    if (props.size && props.size !== 'medium') lines.push(`        size="${props.size}"`);
    if (props.required) {
        lines.push(`        required`);
        lines.push(`        error={${stateVar}Error}`);
    }
    if (props.secureTextEntry) lines.push(`        secureTextEntry`);
    if (props.autoPassword) lines.push(`        autoPassword`);
    if (props.keyboardType && props.keyboardType !== 'default') lines.push(`        keyboardType="${props.keyboardType}"`);
    if (props.multiline) lines.push(`        multiline`);
    if (props.clearable) {
        lines.push(`        clearable`);
        lines.push(`        onClear={() => set${capitalize(stateVar)}('')}`);
    }
    lines.push(`      />`);
    return lines.join('\n');
}

// ─── Shared Prop Controls ────────────────────────────────────────────────────

const inputPropControls = (defaults: {
    label?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    autoPassword?: boolean;
    keyboardType?: string;
    multiline?: boolean;
    clearable?: boolean;
}) => [
        { name: 'label', label: 'Label', type: 'text' as const, defaultValue: defaults.label || 'Label', placeholder: 'e.g. Full Name' },
        { name: 'placeholder', label: 'Placeholder', type: 'text' as const, defaultValue: defaults.placeholder || '', placeholder: 'e.g. Enter value' },
        {
            name: 'variant', label: 'Variant', type: 'select' as const, defaultValue: 'outlined',
            options: [
                { label: 'Default', value: 'default' },
                { label: 'Outlined', value: 'outlined' },
                { label: 'Filled', value: 'filled' },
                { label: 'Underlined', value: 'underlined' },
            ],
        },
        {
            name: 'size', label: 'Size', type: 'select' as const, defaultValue: 'medium',
            options: [
                { label: 'Small', value: 'small' },
                { label: 'Medium', value: 'medium' },
                { label: 'Large', value: 'large' },
            ],
        },
        { name: 'required', label: 'Required', type: 'boolean' as const, defaultValue: false },
        { name: 'errorMessage', label: 'Required Error Msg', type: 'text' as const, defaultValue: 'This field is required', placeholder: 'e.g. This field is required' },
        { name: 'secureTextEntry', label: 'Password Field', type: 'boolean' as const, defaultValue: defaults.secureTextEntry || false },
        { name: 'autoPassword', label: 'Show/Hide Toggle', type: 'boolean' as const, defaultValue: defaults.autoPassword || false },
        {
            name: 'keyboardType', label: 'Keyboard', type: 'select' as const, defaultValue: defaults.keyboardType || 'default',
            options: [
                { label: 'Default', value: 'default' },
                { label: 'Email', value: 'email-address' },
                { label: 'Phone', value: 'phone-pad' },
                { label: 'Number', value: 'numeric' },
            ],
        },
        { name: 'multiline', label: 'Multiline', type: 'boolean' as const, defaultValue: defaults.multiline || false },
        { name: 'clearable', label: 'Clearable', type: 'boolean' as const, defaultValue: defaults.clearable || false },
    ];

// ─── 7 Input Variants ───────────────────────────────────────────────────────

const textInput: ComponentDefinition = {
    type: 'input-text',
    name: 'Text Input',
    category: 'Input',
    icon: '✏️',
    importName: 'CustomInput',
    needsState: true,
    stateType: 'string',
    stateDefault: "''",
    propControls: inputPropControls({ label: 'Full Name', placeholder: 'Enter your name' }),
    generateJSX: generateCustomInputJSX,
};

const emailInput: ComponentDefinition = {
    type: 'input-email',
    name: 'Email Input',
    category: 'Input',
    icon: '📧',
    importName: 'CustomInput',
    needsState: true,
    stateType: 'string',
    stateDefault: "''",
    propControls: inputPropControls({ label: 'Email', placeholder: 'you@example.com', keyboardType: 'email-address' }),
    generateJSX: generateCustomInputJSX,
};

const passwordInput: ComponentDefinition = {
    type: 'input-password',
    name: 'Password Input',
    category: 'Input',
    icon: '🔒',
    importName: 'CustomInput',
    needsState: true,
    stateType: 'string',
    stateDefault: "''",
    propControls: inputPropControls({ label: 'Password', placeholder: '••••••••', secureTextEntry: true, autoPassword: true }),
    generateJSX: generateCustomInputJSX,
};

const phoneInput: ComponentDefinition = {
    type: 'input-phone',
    name: 'Phone Input',
    category: 'Input',
    icon: '📞',
    importName: 'CustomInput',
    needsState: true,
    stateType: 'string',
    stateDefault: "''",
    propControls: inputPropControls({ label: 'Phone Number', placeholder: '+1 (555) 000-0000', keyboardType: 'phone-pad' }),
    generateJSX: generateCustomInputJSX,
};

const numberInput: ComponentDefinition = {
    type: 'input-number',
    name: 'Number Input',
    category: 'Input',
    icon: '🔢',
    importName: 'CustomInput',
    needsState: true,
    stateType: 'string',
    stateDefault: "''",
    propControls: inputPropControls({ label: 'Amount', placeholder: '0.00', keyboardType: 'numeric' }),
    generateJSX: generateCustomInputJSX,
};

const searchInput: ComponentDefinition = {
    type: 'input-search',
    name: 'Search Input',
    category: 'Input',
    icon: '🔍',
    importName: 'CustomInput',
    needsState: true,
    stateType: 'string',
    stateDefault: "''",
    propControls: inputPropControls({ label: 'Search', placeholder: 'Search...', clearable: true }),
    generateJSX: generateCustomInputJSX,
};

const multilineInput: ComponentDefinition = {
    type: 'input-multiline',
    name: 'Multiline Input',
    category: 'Input',
    icon: '📄',
    importName: 'CustomInput',
    needsState: true,
    stateType: 'string',
    stateDefault: "''",
    propControls: inputPropControls({ label: 'Bio', placeholder: 'Tell us about yourself...', multiline: true }),
    generateJSX: generateCustomInputJSX,
};

// ─── DatePicker ──────────────────────────────────────────────────────────────

const datePicker: ComponentDefinition = {
    type: 'date-picker',
    name: 'Date Picker',
    category: 'Input',
    icon: '📅',
    importName: 'DatePicker',
    needsState: true,
    stateType: 'Date | undefined',
    stateDefault: 'undefined',
    propControls: [
        { name: 'label', label: 'Label', type: 'text', defaultValue: 'Select Date', placeholder: 'e.g. Date of Birth' },
        { name: 'required', label: 'Required', type: 'boolean', defaultValue: false },
        { name: 'errorMessage', label: 'Required Error Msg', type: 'text', defaultValue: 'Date is required', placeholder: 'e.g. Date is required' },
    ],
    generateJSX: (props, stateVar) => {
        const lines: string[] = [`      <DatePicker`];
        if (props.label) lines.push(`        label="${props.label}"`);
        lines.push(`        value={${stateVar}}`);
        lines.push(`        onDateChange={set${capitalize(stateVar)}}`);
        if (props.required) {
            lines.push(`        required`);
            lines.push(`        error={${stateVar}Error}`);
        }
        lines.push(`      />`);
        return lines.join('\n');
    },
};

// ─── RainbowButton ───────────────────────────────────────────────────────────

const rainbowButton: ComponentDefinition = {
    type: 'rainbow-button',
    name: 'Rainbow Button',
    category: 'Button',
    icon: '🌈',
    importName: 'RainbowButton',
    needsState: false,
    propControls: [
        { name: 'text', label: 'Button Text', type: 'text', defaultValue: 'Submit', placeholder: 'e.g. Sign Up' },
        { name: 'width', label: 'Width', type: 'number', defaultValue: 320 },
        { name: 'height', label: 'Height', type: 'number', defaultValue: 50 },
    ],
    generateJSX: (props) => {
        const w = Number(props.width || 320);
        return [
            `      <View style={{ alignItems: 'center', width: '100%' }}>`,
            `        <RainbowButton width={${w}} height={${props.height || 50}} onPress={handleSubmit}>`,
            `          <Text style={styles.buttonText}>${props.text || 'Submit'}</Text>`,
            `        </RainbowButton>`,
            `      </View>`,
        ].join('\n');
    },
};

// ─── GradientButton (Tripookie Style) ──────────────────────────────────────────

const gradientButton: ComponentDefinition = {
    type: 'button-gradient',
    name: 'Gradient Button',
    category: 'Button',
    icon: '✨',
    importName: 'GradientButton',
    needsState: false,
    propControls: [
        { name: 'title', label: 'Button Title', type: 'text', defaultValue: 'Submit', placeholder: 'e.g. Sign Up' },
        { name: 'width', label: 'Width', type: 'text', defaultValue: '100%' },
        { name: 'height', label: 'Height (px)', type: 'number', defaultValue: 50 },
        { name: 'color1', label: 'Gradient Start', type: 'color', defaultValue: '#FF5F6D' },
        { name: 'color2', label: 'Gradient End', type: 'color', defaultValue: '#FFC371' },
        { name: 'size', label: 'Size', type: 'select', defaultValue: 'medium', options: [{ label: 'Small', value: 'small' }, { label: 'Medium', value: 'medium' }, { label: 'Large', value: 'large' }] },
        { name: 'borderRadius', label: 'Border Radius', type: 'number', defaultValue: 12 },
    ],
    generateJSX: (props) => {
        const lines = [`      <View style={{ alignItems: 'center', width: '100%' }}>`];
        lines.push(`        <GradientButton`);
        lines.push(`          variant="primary"`);
        lines.push(`          title="${props.title || 'Submit'}"`);
        lines.push(`          gradientColors={['${props.color1 || '#FF5F6D'}', '${props.color2 || '#FFC371'}']}`);
        if (props.size && props.size !== 'medium') lines.push(`          size="${props.size}"`);
        if (props.borderRadius !== 12 && props.borderRadius !== undefined) lines.push(`          borderRadius={${props.borderRadius}}`);

        let styleStr = '';
        if (props.width || props.height) {
            const w = props.width === '100%' ? `'100%'` : Number(props.width || 320);
            styleStr = ` style={{ width: ${w}, height: ${props.height || 50} }}`;
        }

        lines.push(`          onPress={handleSubmit}${styleStr}`);
        lines.push(`        />`);
        lines.push(`      </View>`);
        return lines.join('\n');
    },
};

// ─── SwitchToggle ────────────────────────────────────────────────────────────

const switchToggle: ComponentDefinition = {
    type: 'switch-toggle',
    name: 'Switch Toggle',
    category: 'Input',
    icon: '🔘',
    importName: 'SwitchToggle',
    needsState: true,
    stateType: 'boolean',
    stateDefault: 'false',
    propControls: [
        { name: 'label', label: 'Label', type: 'text', defaultValue: 'Toggle', placeholder: 'e.g. Remember Me' },
    ],
    generateJSX: (props, stateVar) => {
        return [
            `      <View style={styles.switchRow}>`,
            `        <Text style={styles.switchLabel}>${props.label || 'Toggle'}</Text>`,
            `        <SwitchToggle value={${stateVar}} onValueChange={set${capitalize(stateVar)}} />`,
            `      </View>`,
        ].join('\n');
    },
};

// ─── Heading ─────────────────────────────────────────────────────────────────

const heading: ComponentDefinition = {
    type: 'heading',
    name: 'Heading',
    category: 'Layout',
    icon: '📝',
    importName: '',
    needsState: false,
    propControls: [
        { name: 'text', label: 'Text', type: 'text', defaultValue: 'Screen Title', placeholder: 'e.g. Sign Up' },
        {
            name: 'align', label: 'Align', type: 'select', defaultValue: 'left',
            options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
            ],
        },
    ],
    generateJSX: (props) => {
        const align = props.align && props.align !== 'left' ? `, textAlign: '${props.align}' as const` : '';
        return `      <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 8, color: '#111'${align} }}>${props.text || 'Screen Title'}</Text>`;
    },
};

// ─── Spacer ──────────────────────────────────────────────────────────────────

const spacer: ComponentDefinition = {
    type: 'spacer',
    name: 'Spacer',
    category: 'Layout',
    icon: '↕️',
    importName: '',
    needsState: false,
    propControls: [
        { name: 'height', label: 'Height (px)', type: 'number', defaultValue: 20 },
    ],
    generateJSX: (props) => {
        return `      <View style={{ height: ${props.height || 20} }} />`;
    },
};

// ─── Export ──────────────────────────────────────────────────────────────────

export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
    heading,
    spacer,
    textInput,
    emailInput,
    passwordInput,
    phoneInput,
    numberInput,
    searchInput,
    multilineInput,
    datePicker,
    switchToggle,
    rainbowButton,
    gradientButton,
];

export function getDefinition(type: string): ComponentDefinition | undefined {
    return COMPONENT_DEFINITIONS.find((d) => d.type === type);
}

export const CATEGORIES = ['Layout', 'Input', 'Button'] as const;
