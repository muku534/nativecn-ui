// ─── Canvas Node ─────────────────────────────────────────────────────────────
// Represents a component instance placed on the canvas

export interface CanvasNode {
    /** Unique ID for this instance */
    id: string;
    /** Component type (matches ComponentDefinition.type) */
    type: string;
    /** Configured props for this instance */
    props: Record<string, any>;
    /** Order index on the canvas */
    order: number;
}

// ─── Prop Control Types ──────────────────────────────────────────────────────
// Defines how each configurable prop renders in the PropsPanel

export type PropControlType = 'text' | 'boolean' | 'select' | 'number' | 'color';

export interface PropControl {
    /** Prop name (e.g. "label", "variant") */
    name: string;
    /** Display label in the props panel */
    label: string;
    /** Control type to render */
    type: PropControlType;
    /** Default value */
    defaultValue: any;
    /** Options for 'select' type */
    options?: { label: string; value: string }[];
    /** Whether this prop generates a state variable */
    generatesState?: boolean;
    /** Placeholder for text inputs */
    placeholder?: string;
}

// ─── Component Definition ────────────────────────────────────────────────────
// Metadata for each draggable component in the palette

export interface ComponentDefinition {
    /** Component type ID */
    type: string;
    /** Display name */
    name: string;
    /** Category (Input, Button, etc.) */
    category: string;
    /** Emoji icon */
    icon: string;
    /** Configurable props */
    propControls: PropControl[];
    /** Function to generate JSX string from props */
    generateJSX: (props: Record<string, any>, stateVarName: string) => string;
    /** Import name for the component */
    importName: string;
    /** Whether this component needs a state variable */
    needsState: boolean;
    /** State type (e.g. "string", "Date | undefined") */
    stateType?: string;
    /** Default state value string */
    stateDefault?: string;
}

// ─── Saved Design ────────────────────────────────────────────────────────────
// Structure saved to localStorage

export interface SavedDesign {
    nodes: CanvasNode[];
    savedAt: number; // timestamp
    expiresAt: number; // timestamp (savedAt + 60 min)
}
