import React, { useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    PanResponder,
    ViewStyle,
    Dimensions
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DEFAULT_COLORS = {
    PaleBlue: '#E5E7EB',
    darkgray: '#374151',
    white: '#FFFFFF',
    BrightPink: '#FF0080',
};

interface RangeSliderProps {
    value: number;
    onValueChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    trackColor?: string;
    activeTrackColor?: string;
    thumbColor?: string;
    style?: ViewStyle;
    width?: number;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
    value,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    trackColor,
    activeTrackColor,
    thumbColor,
    style,
    width
}) => {
    const COLORS = DEFAULT_COLORS;
    const SLIDER_WIDTH = width || (SCREEN_WIDTH * 0.9);
    const THUMB_SIZE = 28;

    const pan = useRef(new Animated.Value(0)).current;
    const lastValue = useRef(value);

    // Sync thumb position if value changes from outside
    useEffect(() => {
        const pos = ((value - min) / (max - min)) * (SLIDER_WIDTH - THUMB_SIZE);
        pan.setValue(pos);
        lastValue.current = value;
    }, [value, min, max, SLIDER_WIDTH]);

    const startX = useRef(0);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                // @ts-ignore - access private value for synchronous read
                startX.current = pan._value;
            },
            onPanResponderMove: (_: any, gesture: any) => {
                let newX = startX.current + gesture.dx;
                newX = Math.max(0, Math.min(newX, SLIDER_WIDTH - THUMB_SIZE));
                pan.setValue(newX);
                const percent = newX / (SLIDER_WIDTH - THUMB_SIZE);
                let newValue = Math.round((percent * (max - min) + min) / step) * step;
                if (newValue !== lastValue.current) {
                    lastValue.current = newValue;
                    onValueChange(newValue);
                }
            },
            onPanResponderRelease: (_: any, gesture: any) => {
                let newX = startX.current + gesture.dx;
                newX = Math.max(0, Math.min(newX, SLIDER_WIDTH - THUMB_SIZE));
                const percent = newX / (SLIDER_WIDTH - THUMB_SIZE);
                let newValue = Math.round((percent * (max - min) + min) / step) * step;
                const snappedX = ((newValue - min) / (max - min)) * (SLIDER_WIDTH - THUMB_SIZE);

                Animated.spring(pan, {
                    toValue: snappedX,
                    useNativeDriver: false,
                    friction: 7,
                }).start();

                if (newValue !== lastValue.current) {
                    lastValue.current = newValue;
                    onValueChange(newValue);
                }
            },
        })
    ).current;

    const fillWidth = pan.interpolate({
        inputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
        outputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
        extrapolate: 'clamp',
    });

    return (
        <View style={[styles.sliderWrap, { width: SLIDER_WIDTH }, style]}>
            <View style={[styles.track, { backgroundColor: trackColor || COLORS.PaleBlue }]} />
            <Animated.View
                style={[
                    styles.fill,
                    {
                        width: fillWidth,
                        backgroundColor: activeTrackColor || COLORS.darkgray
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.thumb,
                    {
                        backgroundColor: thumbColor || COLORS.white,
                        borderColor: activeTrackColor || COLORS.darkgray,
                        transform: [{ translateX: pan }],
                    },
                ]}
                {...panResponder.panHandlers}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    sliderWrap: {
        height: 28,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    track: {
        position: 'absolute',
        height: 8,
        borderRadius: 4,
        width: '100%',
        top: 10, // (28 - 8) / 2
    },
    fill: {
        position: 'absolute',
        height: 8,
        borderRadius: 4,
        top: 10,
    },
    thumb: {
        position: 'absolute',
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 4,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        top: 0,
    },
});

export default RangeSlider;
