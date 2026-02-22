import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

/**
 * ─── Gradient Button ──────────────────────────────────────────────────────────
 * A highly customizable premium gradient button that supports variants, loading
 * states, and full styling overrides.
 * 
 * Note: Requires `react-native-linear-gradient` to be installed.
 */

const DEFAULT_COLORS = {
    white: '#FFFFFF',
    lightGray: '#F5F5F5',
    Midgray: '#CCCCCC',
    darkgray: '#333333',
    BrightPink: '#FF5F6D',
    TomatoRed: '#FFC371'
};

const GradientButton = ({
    // Basic props
    title,
    onPress,
    disabled = false,
    loading = false,

    // Button variants
    variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost', 'link'
    size = 'medium', // 'small', 'medium', 'large'

    // Custom styling
    style,
    textStyle,
    colors = DEFAULT_COLORS, // Custom colors override

    // Icons
    leftIcon,
    rightIcon,
    iconOnly = false,

    // Additional props
    fullWidth = true,
    borderRadius,
    borderColor, // Custom border color for outline variant

    // Custom gradient colors (for primary variant)
    gradientColors,
}: any) => {

    // Safely fallback to our default colors if hooks aren't provided
    const COLORS = colors || DEFAULT_COLORS;
    const styles = getStyles(COLORS, false, variant, size, fullWidth, borderRadius, borderColor);

    const effectiveGradientColors = gradientColors || [COLORS.BrightPink, COLORS.TomatoRed];

    // Render button content
    const renderContent = () => {
        if (loading) {
            return (
                <ActivityIndicator
                    color={variant === 'outline' || variant === 'ghost' ? COLORS.BrightPink : COLORS.white}
                    size={size === 'small' ? 'small' : 'large'}
                />
            );
        }

        return (
            <View style={styles.contentContainer}>
                {leftIcon && !iconOnly && (
                    <View style={styles.leftIconContainer}>
                        {leftIcon}
                    </View>
                )}

                {leftIcon && iconOnly ? leftIcon : null}

                {!iconOnly && (
                    <Text style={[styles.buttonText, textStyle]}>
                        {title}
                    </Text>
                )}

                {rightIcon && !iconOnly && (
                    <View style={styles.rightIconContainer}>
                        {rightIcon}
                    </View>
                )}
            </View>
        );
    };

    // Primary variant with gradient
    if (variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.8}
                style={[styles.container, style]}
            >
                <LinearGradient
                    key={loading ? 'loading' : 'normal'}
                    colors={effectiveGradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.button, style]}
                >
                    {renderContent()}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    // All other variants
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[styles.container, styles.button, style]}
        >
            {renderContent()}
        </TouchableOpacity>
    );
};

const getStyles = (COLORS: any, isTablet: boolean, variant: string, size: string, fullWidth: boolean, customBorderRadius: number, customBorderColor: string) => {
    // Basic scaling multipliers
    const wp = (percent: number) => percent * 4;
    const hp = (percent: number) => percent * 8;

    // Size configurations
    const sizeConfigs: Record<string, any> = {
        small: {
            height: hp(4.5),
            paddingHorizontal: wp(4),
            fontSize: hp(1.7),
            borderRadius: wp(2),
        },
        medium: {
            height: hp(6),
            paddingHorizontal: wp(6),
            fontSize: hp(2.1),
            borderRadius: wp(4),
        },
        large: {
            height: hp(7),
            paddingHorizontal: wp(8),
            fontSize: hp(2.4),
            borderRadius: wp(5),
        },
    };

    const currentSize = sizeConfigs[size] || sizeConfigs.medium;
    const borderRadius = customBorderRadius !== undefined ? customBorderRadius : currentSize.borderRadius;

    // Base button styles
    const baseButtonStyles = {
        height: currentSize.height,
        paddingHorizontal: currentSize.paddingHorizontal,
        borderRadius: borderRadius,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        flexDirection: 'row' as const,
    };

    // Width configuration
    const widthStyles = fullWidth ? {
        width: '100%',
        alignSelf: 'center' as const,
    } : {
        alignSelf: 'flex-start' as const,
    };

    // Variant-specific styles
    const variantStyles: Record<string, any> = {
        primary: {
            paddingHorizontal: 0, // Gradient handles padding natively
        },
        secondary: {
            backgroundColor: COLORS.lightGray,
            borderWidth: 1,
            borderColor: COLORS.Midgray,
        },
        outline: {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: customBorderColor || COLORS.BrightPink,
        },
        ghost: {
            backgroundColor: 'transparent',
        },
        link: {
            backgroundColor: 'transparent',
            height: 'auto',
            paddingHorizontal: 0,
        },
    };

    // Text color based on variant
    const getTextColor = () => {
        switch (variant) {
            case 'primary':
                return COLORS.white;
            case 'secondary':
                return COLORS.darkgray;
            case 'outline':
                return customBorderColor || COLORS.BrightPink;
            case 'ghost':
            case 'link':
                return COLORS.BrightPink;
            default:
                return COLORS.white;
        }
    };

    return StyleSheet.create({
        container: {
            ...widthStyles,
        },
        button: {
            ...baseButtonStyles,
            ...variantStyles[variant],
        } as any,
        contentContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
        },
        leftIconContainer: {
            marginRight: wp(2),
        },
        rightIconContainer: {
            marginLeft: wp(2),
        },
        buttonText: {
            fontSize: currentSize.fontSize,
            color: getTextColor(),
            fontWeight: '600',
            textAlign: 'center',
        },
    });
};

export default GradientButton;
