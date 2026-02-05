// This file allows TypeScript to compile "react-native" imports in this project
// without actually having react-native installed. This is for the Component Registry.

declare module 'react-native' {
    export const View: any;
    export const Text: any;
    export const Image: any;
    export const TouchableOpacity: any;
    export const TouchableHighlight: any;
    export const TouchableWithoutFeedback: any;
    export const ScrollView: any;
    export const FlatList: any;
    export const SectionList: any;
    export const TextInput: any;
    export const Modal: any;
    export const Switch: any;
    export const ActivityIndicator: any;
    export const StyleSheet: {
        create: (style: any) => any;
        absoluteFill: any;
        absoluteFillObject: any;
        hairlineWidth: number;
    };
    export const Animated: any;
    export const Dimensions: {
        get: (dim: string) => { width: number; height: number };
        addEventListener: any;
    };
    export const Platform: {
        OS: string;
        select: (obj: any) => any;
    };
    export const Easing: any;
    export const PanResponder: any;
    export const Alert: any;
    export const Keyboard: any;
    export const KeyboardAvoidingView: any;
    export const SafeAreaView: any;
    export const StatusBar: any;
    export const PixelRatio: any;
    export const Linking: any;
    export const Share: any;
    export const Vibration: any;
    export const I18nManager: any;
    export const NativeModules: any;

    export type ViewStyle = any;
    export type TextStyle = any;
    export type ImageStyle = any;
    export type DimensionValue = any;
    export type SwitchProps = any;
    export type LayoutChangeEvent = any;
    export type NativeSyntheticEvent<T> = any;
    export type NativeScrollEvent = any;
}

declare module 'react-native-linear-gradient' {
    const LinearGradient: any;
    export default LinearGradient;
}

declare module 'react-native-svg' {
    export const Svg: any;
    export const Circle: any;
    export const Rect: any;
    export const Path: any;
    export const G: any;
    export const Defs: any;
    export const LinearGradient: any;
    export const Stop: any;
    export const Polygon: any;
    export const Line: any;
    export const ClipPath: any;
    export default Svg;
}

declare module 'react-native-vector-icons/Ionicons' {
    const Ionicons: any;
    export default Ionicons;
}

declare module 'react-native-vector-icons/Entypo' {
    const Entypo: any;
    export default Entypo;
}

declare module 'react-native-vector-icons/FontAwesome' {
    const FontAwesome: any;
    export default FontAwesome;
}

declare module 'react-native-vector-icons/Feather' {
    const Feather: any;
    export default Feather;
}

declare module 'react-native-vector-icons/MaterialIcons' {
    const MaterialIcons: any;
    export default MaterialIcons;
}

declare module 'react-native-vector-icons/MaterialCommunityIcons' {
    const MaterialCommunityIcons: any;
    export default MaterialCommunityIcons;
}
