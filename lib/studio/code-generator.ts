import { CanvasNode } from './types';
import { getDefinition } from './component-definitions';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function toVarName(label: string): string {
    // "Full Name" → "fullName", "Date of Birth" → "dateOfBirth"
    return label
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .trim()
        .split(/\s+/)
        .map((w, i) => (i === 0 ? w.toLowerCase() : capitalize(w.toLowerCase())))
        .join('');
}

// ─── Code Generator ──────────────────────────────────────────────────────────

export function generateScreenCode(nodes: CanvasNode[], screenName: string = 'MyScreen'): string {
    if (nodes.length === 0) {
        return '// Drag components onto the canvas to generate code';
    }

    const sorted = [...nodes].sort((a, b) => a.order - b.order);

    // Collect unique component imports
    const imports = new Set<string>();
    const rnImports = new Set<string>(['View', 'ScrollView', 'StyleSheet', 'Text', 'KeyboardAvoidingView', 'Platform']);

    // Track state variables
    const stateVars: { name: string; type: string; default: string }[] = [];

    // Track required fields for validation
    const requiredFields: { varName: string; label: string; type: string; errorMessage: string }[] = [];

    // Check if we need Alert (for submit button)
    const hasButton = sorted.some((n) => n.type === 'rainbow-button');
    if (hasButton) rnImports.add('Alert');

    // Process each node
    const jsxLines: string[] = [];
    let stateIndex = 0;

    for (const node of sorted) {
        const def = getDefinition(node.type);
        if (!def) continue;

        // Add import
        if (def.importName) imports.add(def.importName);

        // Generate state variable name from label
        let stateVar = '';
        if (def.needsState) {
            const label = node.props.label || `field${stateIndex}`;
            stateVar = toVarName(label);

            // Avoid duplicates
            const existing = stateVars.find((v) => v.name === stateVar);
            if (existing) {
                stateVar = `${stateVar}${stateIndex}`;
            }

            stateVars.push({
                name: stateVar,
                type: def.stateType || 'string',
                default: def.stateDefault || "''",
            });

            // Track required for validation
            if (node.props.required) {
                requiredFields.push({
                    varName: stateVar,
                    label: node.props.label || label,
                    type: def.stateType || 'string',
                    errorMessage: node.props.errorMessage || 'This field is required',
                });

                // Generate matching error state
                stateVars.push({
                    name: `${stateVar}Error`,
                    type: 'string',
                    default: "''",
                });
            }

            stateIndex++;
        }

        // Generate JSX
        jsxLines.push(def.generateJSX(node.props, stateVar));
    }

    // Build the file
    const lines: string[] = [];

    // Imports
    lines.push(`import React, { useState } from 'react';`);
    lines.push(`import { ${[...rnImports].join(', ')} } from 'react-native';`);
    lines.push(`import { SafeAreaProvider } from 'react-native-safe-area-context';`);

    if (imports.size > 0) {
        lines.push('');
        for (const imp of imports) {
            lines.push(`import ${imp} from './${imp}';`);
        }
    }

    lines.push('');
    lines.push(`export default function ${screenName}() {`);

    // State variables
    if (stateVars.length > 0) {
        for (const sv of stateVars) {
            if (sv.type === 'string') {
                lines.push(`  const [${sv.name}, set${capitalize(sv.name)}] = useState('');`);
            } else if (sv.type === 'boolean') {
                lines.push(`  const [${sv.name}, set${capitalize(sv.name)}] = useState(false);`);
            } else {
                lines.push(`  const [${sv.name}, set${capitalize(sv.name)}] = useState<${sv.type}>(${sv.default});`);
            }
        }
        lines.push('');
    }

    // Submit handler
    if (hasButton) {
        lines.push(`  const handleSubmit = () => {`);
        if (requiredFields.length > 0) {
            lines.push(`    let isValid = true;`);
            lines.push(``);

            // Clear all errors first
            for (const f of requiredFields) {
                lines.push(`    set${capitalize(f.varName)}Error('');`);
            }
            lines.push(``);

            // Validate fields
            for (const f of requiredFields) {
                if (f.type.includes('Date')) {
                    lines.push(`    if (!${f.varName}) {`);
                    lines.push(`      set${capitalize(f.varName)}Error('${f.errorMessage.replace(/'/g, "\\'")}');`);
                    lines.push(`      isValid = false;`);
                    lines.push(`    }`);
                } else if (f.type !== 'boolean') {
                    lines.push(`    if (!${f.varName}.trim()) {`);
                    lines.push(`      set${capitalize(f.varName)}Error('${f.errorMessage.replace(/'/g, "\\'")}');`);
                    lines.push(`      isValid = false;`);
                    lines.push(`    }`);
                }
            }

            // Password match check
            const passwordFields = sorted.filter(
                (n) => n.type === 'input-password' || (n.type.startsWith('input-') && n.props.secureTextEntry)
            );
            if (passwordFields.length >= 2) {
                const pw1 = toVarName(passwordFields[0].props.label || 'password');
                const pw2 = toVarName(passwordFields[1].props.label || 'confirmPassword');
                lines.push(`    if (${pw1} !== ${pw2}) {`);
                lines.push(`      Alert.alert('Error', 'Passwords do not match');`);
                lines.push(`      isValid = false;`);
                lines.push(`    }`);
            }

            lines.push(``);
            lines.push(`    if (!isValid) return;`);
            lines.push(``);
        }
        lines.push(`    Alert.alert('Success', 'Form submitted successfully!');`);
        lines.push(`  };`);
        lines.push('');
    }

    // JSX
    lines.push(`  return (`);
    lines.push(`    <SafeAreaProvider>`);
    lines.push(`      <KeyboardAvoidingView`);
    lines.push(`        style={styles.keyboardAvoiding}`);
    lines.push(`        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`);
    lines.push(`      >`);
    lines.push(`        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">`);
    lines.push(jsxLines.map(line => `          ${line}`).join('\n'));
    lines.push(`        </ScrollView>`);
    lines.push(`      </KeyboardAvoidingView>`);
    lines.push(`    </SafeAreaProvider>`);
    lines.push(`  );`);
    lines.push(`}`);

    // Styles
    lines.push('');
    lines.push(`const styles = StyleSheet.create({`);
    lines.push(`  keyboardAvoiding: {`);
    lines.push(`    flex: 1,`);
    lines.push(`    backgroundColor: '#fff',`);
    lines.push(`  },`);
    lines.push(`  container: {`);
    lines.push(`    flex: 1,`);
    lines.push(`    padding: 20,`);
    lines.push(`  },`);

    // Add switch styles if there's a switch toggle
    if (sorted.some((n) => n.type === 'switch-toggle')) {
        lines.push(`  switchRow: {`);
        lines.push(`    flexDirection: 'row',`);
        lines.push(`    alignItems: 'center',`);
        lines.push(`    justifyContent: 'space-between',`);
        lines.push(`    paddingVertical: 12,`);
        lines.push(`  },`);
        lines.push(`  switchLabel: {`);
        lines.push(`    fontSize: 16,`);
        lines.push(`    color: '#333',`);
        lines.push(`  },`);
    }

    // Button text styles
    if (hasButton) {
        lines.push(`  buttonText: {`);
        lines.push(`    color: '#fff',`);
        lines.push(`    fontSize: 16,`);
        lines.push(`    fontWeight: '600',`);
        lines.push(`  },`);
    }

    lines.push(`});`);
    lines.push('');

    return lines.join('\n');
}

// ─── Dependencies List ──────────────────────────────────────────────────────

export function getRequiredFiles(nodes: CanvasNode[]): string[] {
    const files = new Set<string>();
    for (const node of nodes) {
        const def = getDefinition(node.type);
        if (def?.importName) {
            files.add(`${def.importName}.tsx`);
        }
    }
    return [...files];
}
