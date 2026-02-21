import React, { useState, forwardRef, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';

// ─── Default Colors ──────────────────────────────────────────────────────────

const DEFAULT_COLORS = {
    primary: '#1a1a2e',
    background: '#f5f5f5',
    border: '#c0c0c0',
    text: '#1a1a2e',
    placeholder: '#a0a0a0',
    error: '#e74c3c',
    success: '#2ecc71',
    disabled: '#e0e0e0',
    white: '#ffffff',
};

// ─── Size Config ─────────────────────────────────────────────────────────────

const SIZE_CONFIG = {
    small: { height: 40, fontSize: 13, px: 12, iconSize: 18 },
    medium: { height: 48, fontSize: 15, px: 16, iconSize: 20 },
    large: { height: 56, fontSize: 17, px: 20, iconSize: 22 },
};

// ─── Component ───────────────────────────────────────────────────────────────

const CustomInput = forwardRef((
    {
        label,
        placeholder,
        value,
        onChangeText,

        secureTextEntry = false,
        autoPassword = false,
        multiline = false,
        numberOfLines = 1,
        maxNumberOfLines = 4,
        maxLength,

        leftIcon,
        rightIcon,
        showSearchIcon,

        variant = 'default',
        size = 'medium',
        disabled = false,
        editable = true,

        error,
        success,
        helperText,
        required = false,

        containerStyle,
        inputStyle,
        labelStyle,
        placeholderTextColor,

        onFocus,
        onBlur,
        clearable = false,
        onClear,
        colors: customColors,

        ...rest
    },
    ref
) => {
    const COLORS = { ...DEFAULT_COLORS, ...customColors };
    const sizeConfig = SIZE_CONFIG[size] || SIZE_CONFIG.medium;

    const shouldShowSearchIcon =
        showSearchIcon !== undefined ? showSearchIcon : variant === 'search';

    const [isSecureVisible, setIsSecureVisible] = useState(secureTextEntry);
    const [isFocused, setIsFocused] = useState(false);
    const [androidHeight, setAndroidHeight] = useState(null);

    // ─── Handlers ────────────────────────────────

    const handleFocus = useCallback(
        (e) => {
            setIsFocused(true);
            onFocus?.(e);
        },
        [onFocus]
    );

    const handleBlur = useCallback(
        (e) => {
            setIsFocused(false);
            onBlur?.(e);
        },
        [onBlur]
    );

    const toggleSecure = useCallback(() => {
        setIsSecureVisible((prev) => !prev);
    }, []);

    const handleContentSizeChange = useCallback(
        (e) => {
            if (!multiline || Platform.OS !== 'android') return;
            const { height } = e.nativeEvent.contentSize;
            const lineH = sizeConfig.fontSize * 1.4;
            const minH = lineH + 8;
            const maxH = lineH * maxNumberOfLines + 8;
            const newH = Math.min(Math.max(height + 8, minH), maxH);
            if (newH !== androidHeight) setAndroidHeight(newH);
        },
        [multiline, sizeConfig.fontSize, maxNumberOfLines, androidHeight]
    );

    // ─── Styles ──────────────────────────────────

    const showPasswordToggle = autoPassword && secureTextEntry;

    const getVariantStyle = () => {
        switch (variant) {
            case 'outlined':
                return {
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    backgroundColor: 'transparent',
                };
            case 'filled':
                return {
                    backgroundColor: COLORS.background,
                    borderWidth: 0,
                };
            case 'underlined':
                return {
                    borderRadius: 0,
                    borderBottomWidth: 1.5,
                    borderBottomColor: COLORS.border,
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                };
            case 'search':
                return {
                    borderRadius: 24,
                    backgroundColor: COLORS.background,
                    borderWidth: 0,
                };
            default:
                return {
                    borderWidth: 0.5,
                    borderColor: COLORS.border,
                };
        }
    };

    const getStateStyle = () => {
        if (error) {
            return {
                borderColor: COLORS.error,
                borderWidth: variant === 'underlined' ? 0 : 1,
                borderBottomWidth: variant === 'underlined' ? 2 : 1,
            };
        }
        if (success) {
            return {
                borderColor: COLORS.success,
                borderWidth: variant === 'underlined' ? 0 : 1,
                borderBottomWidth: variant === 'underlined' ? 2 : 1,
            };
        }
        if (isFocused) {
            return {
                borderColor: COLORS.primary,
                borderWidth: variant === 'underlined' ? 0 : 1,
                borderBottomWidth: variant === 'underlined' ? 2 : 1,
            };
        }
        return {};
    };

    const containerBaseStyle = {
        flexDirection: 'row',
        alignItems: multiline ? 'flex-start' : 'center',
        borderRadius: 8,
        backgroundColor: COLORS.background,
        height: multiline ? undefined : sizeConfig.height,
        minHeight: multiline ? sizeConfig.height : undefined,
        paddingHorizontal: sizeConfig.px,
        ...getVariantStyle(),
        ...getStateStyle(),
        ...(disabled ? { backgroundColor: COLORS.disabled, opacity: 0.6 } : {}),
        ...(multiline && Platform.OS === 'android' && androidHeight
            ? { height: androidHeight }
            : {}),
    };

    // ─── Render ──────────────────────────────────

    return (
        <View style={styles.wrapper}>
            {/* Label */}
            {label && (
                <Text style={[styles.label, { color: COLORS.text }, labelStyle]}>
                    {label}
                    {required && <Text style={{ color: COLORS.error }}> *</Text>}
                </Text>
            )}

            {/* Input Container */}
            <View style={[containerBaseStyle, containerStyle]}>
                {/* Left Icon / Search Icon */}
                {(leftIcon || shouldShowSearchIcon) && (
                    <View style={styles.iconLeft}>
                        {leftIcon || (
                            <Text style={{ fontSize: sizeConfig.iconSize, color: COLORS.placeholder }}>
                                🔍
                            </Text>
                        )}
                    </View>
                )}

                {/* TextInput */}
                <TextInput
                    ref={ref}
                    style={[
                        styles.input,
                        {
                            fontSize: sizeConfig.fontSize,
                            color: COLORS.text,
                            textAlignVertical: multiline ? 'top' : 'center',
                            paddingVertical: multiline ? 12 : 4,
                        },
                        inputStyle,
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor || COLORS.placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={isSecureVisible}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    maxLength={maxLength}
                    editable={editable && !disabled}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onContentSizeChange={
                        Platform.OS === 'android' ? handleContentSizeChange : undefined
                    }
                    {...rest}
                />

                {/* Password Toggle */}
                {showPasswordToggle && (
                    <TouchableOpacity
                        onPress={toggleSecure}
                        style={styles.iconRight}
                        disabled={disabled}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={{ fontSize: sizeConfig.iconSize }}>
                            {isSecureVisible ? '👁️‍🗨️' : '👁️'}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Right Icon */}
                {!showPasswordToggle && rightIcon && (
                    <View style={styles.iconRight}>{rightIcon}</View>
                )}

                {/* Clear Button */}
                {clearable && (value?.length ?? 0) > 0 && !showPasswordToggle && (
                    <TouchableOpacity
                        onPress={onClear}
                        style={styles.iconRight}
                        disabled={disabled}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={{ fontSize: sizeConfig.iconSize, color: COLORS.placeholder }}>
                            ✕
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Feedback Text */}
            {error && <Text style={[styles.feedbackText, { color: COLORS.error }]}>{error}</Text>}
            {success && !error && (
                <Text style={[styles.feedbackText, { color: COLORS.success }]}>{success}</Text>
            )}
            {helperText && !error && !success && (
                <Text style={[styles.feedbackText, { color: COLORS.placeholder }]}>
                    {helperText}
                </Text>
            )}
        </View>
    );
});

CustomInput.displayName = 'CustomInput';

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        flex: 1,
        padding: 0,
        margin: 0,
        outlineStyle: 'none',
        borderWidth: 0,
    },
    iconLeft: {
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconRight: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    feedbackText: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});

export default CustomInput;
