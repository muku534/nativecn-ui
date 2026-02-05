import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform, ViewStyle } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const wp = (percentage: number) => (percentage * SCREEN_WIDTH) / 100;
const hp = (percentage: number) => (percentage * SCREEN_HEIGHT) / 100;

const DEFAULT_COLORS = {
    WhiteSmoke: '#F5F5F5',
    darkgray: '#374151',
    darkgray1: '#4B5563',
    BrightPink: '#FF0080',
    white: '#FFFFFF',
    Black: '#000000',
};

// Mock Haptics
const triggerMediumHaptic = () => { };

interface AnimatedBottomNavProps {
    state: any;
    descriptors: any;
    navigation: any;
    activeColor?: string;
    inactiveColor?: string;
    backgroundColor?: string;
}

const AnimatedBottomNav = ({
    state,
    descriptors,
    navigation,
    activeColor,
    inactiveColor,
    backgroundColor
}: AnimatedBottomNavProps) => {
    const COLORS = DEFAULT_COLORS;
    const styles = getStyles(COLORS, backgroundColor);

    const TAB_COUNT = state.routes.length;
    // Adjust based on your tab count logic
    const TAB_WIDTH = (wp(75) - wp(2) * 2) / TAB_COUNT;

    const indicatorAnim = useRef(new Animated.Value(0)).current;

    // Scale and Opacity animations for each tab
    const scaleAnims = useRef(state.routes.map(() => new Animated.Value(1))).current;
    const opacityAnims = useRef(state.routes.map(() => new Animated.Value(0.7))).current;

    useEffect(() => {
        Animated.timing(indicatorAnim, {
            toValue: state.index,
            duration: 300,
            useNativeDriver: true,
        }).start();

        state.routes.forEach((_: any, index: any) => {
            const isFocused = state.index === index;

            Animated.parallel([
                Animated.spring(scaleAnims[index], {
                    toValue: isFocused ? 1.1 : 1,
                    friction: 4,
                    tension: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnims[index], {
                    toValue: isFocused ? 1 : 0.7,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    }, [state.index]);

    return (
        <View style={styles.tabBar}>
            {/* Sliding Indicator */}
            <Animated.View
                style={[
                    styles.tabIndicator,
                    {
                        width: TAB_WIDTH,
                        left: wp(2),
                        transform: [
                            {
                                translateX: indicatorAnim.interpolate({
                                    inputRange: state.routes.map((_: any, i: any) => i),
                                    outputRange: state.routes.map((_: any, i: any) => TAB_WIDTH * i),
                                }),
                            },
                        ],
                    },
                ]}
            />

            {state.routes.map((route: any, index: any) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                    triggerMediumHaptic();
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        activeOpacity={0.8}
                        onPress={onPress}
                        style={styles.tabButton}
                    >
                        <Animated.View
                            style={{
                                transform: [{ scale: scaleAnims[index] }],
                                opacity: opacityAnims[index],
                                alignItems: 'center',
                            }}
                        >
                            {/* Render Icon from options or fallback */}
                            {options.tabBarIcon ? (
                                options.tabBarIcon({ focused: isFocused, color: isFocused ? (activeColor || COLORS.BrightPink) : (inactiveColor || COLORS.darkgray) })
                            ) : (
                                <View style={{ width: 24, height: 24, backgroundColor: isFocused ? (activeColor || COLORS.BrightPink) : (inactiveColor || COLORS.darkgray), borderRadius: 12 }} />
                            )}
                        </Animated.View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const getStyles = (COLORS: any, backgroundColor?: string) => StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: backgroundColor || COLORS.white,
        borderRadius: wp(10), // High border radius for floating look
        marginHorizontal: wp(10),
        marginBottom: hp(4),
        height: hp(8),
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'space-between',
        paddingHorizontal: wp(2),
        width: wp(75),
        alignSelf: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        zIndex: 2,
    },
    tabIndicator: {
        position: 'absolute',
        height: hp(6),
        backgroundColor: COLORS.WhiteSmoke, // Or a specific indicator color
        borderRadius: wp(8),
        zIndex: 1,
    }
});

export default AnimatedBottomNav;
