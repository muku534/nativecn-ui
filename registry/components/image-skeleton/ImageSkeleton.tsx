// ImageSkeleton.tsx — Premium grid animation skeleton
// Uses @shopify/react-native-skia for a premium orbiting spotlight effect
import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import {
  Canvas,
  RoundedRect,
  Points,
  vec,
  Group,
  RadialGradient,
  Rect,
  Mask,
} from '@shopify/react-native-skia';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  useDerivedValue,
} from 'react-native-reanimated';

export interface ImageSkeletonProps {
  /** Width of the skeleton container */
  width: number;
  /** Height of the skeleton container */
  height: number;
  /** Corner radius (default: 16) */
  borderRadius?: number;
  /** Base background color (default: '#171717') */
  baseColor?: string;
  /** Color of the base dim dots (default: '#ffffff') */
  dotColor?: string;
  /** Color of the sweeping spotlight highlight (default: '#ffffff') */
  accentColor?: string;
  /** Animation duration for one full cycle in ms (default: 4000) */
  duration?: number;
  /** Container style override */
  style?: ViewStyle;
}

export default function ImageSkeleton({
  width,
  height,
  borderRadius = 16,
  baseColor = '#171717',
  dotColor = '#ffffff',
  accentColor = '#ffffff',
  duration = 4000,
  style,
}: ImageSkeletonProps) {
  
  const DOT_SPACING = 16;
  const DOT_SIZE = 2.5;

  // Generate grid points once based on dimensions
  const points = useMemo(() => {
    const pts = [];
    const cols = Math.floor(width / DOT_SPACING);
    const rows = Math.floor(height / DOT_SPACING);
    const offsetX = (width - (cols - 1) * DOT_SPACING) / 2;
    const offsetY = (height - (rows - 1) * DOT_SPACING) / 2;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        pts.push(vec(offsetX + i * DOT_SPACING, offsetY + j * DOT_SPACING));
      }
    }
    return pts;
  }, [width, height]);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(Math.PI * 2, { duration, easing: Easing.linear }),
      -1,
      false
    );
  }, [duration]);

  // First orbiting spotlight
  const center1 = useDerivedValue(() => {
    const r = Math.min(width, height) * 0.4;
    return vec(
      width / 2 + Math.cos(progress.value) * r,
      height / 2 + Math.sin(progress.value) * r
    );
  });

  // Second orbiting spotlight moving at a different phase/speed
  const center2 = useDerivedValue(() => {
    const r = Math.min(width, height) * 0.4;
    return vec(
      width / 2 + Math.sin(progress.value * 1.5) * r,
      height / 2 + Math.cos(progress.value * 1.5) * r
    );
  });
  
  const radius = Math.max(width, height) * 0.7;

  return (
    <View style={[styles.container, { width, height, borderRadius }, style]}>
      <Canvas style={{ width, height }}>
        {/* Base Background */}
        <RoundedRect x={0} y={0} width={width} height={height} r={borderRadius} color={baseColor} />

        {/* Dim base dots */}
        <Group opacity={0.08}>
          <Points
            points={points}
            mode="points"
            color={dotColor}
            strokeWidth={DOT_SIZE}
            strokeCap="round"
          />
        </Group>

        {/* Highlighted dots using a Luminance Mask */}
        <Mask
          mode="luminance"
          mask={
            <Group>
              <Rect x={0} y={0} width={width} height={height} color="black" />
              <Points
                points={points}
                mode="points"
                color="white"
                strokeWidth={DOT_SIZE + 0.5} // Slightly thicker for the glow
                strokeCap="round"
              />
            </Group>
          }
        >
          {/* Animated Glow 1 */}
          <Rect x={0} y={0} width={width} height={height}>
            <RadialGradient
              c={center1}
              r={radius}
              colors={[`${accentColor}E6`, `${accentColor}00`]} // E6 is 90% opacity
            />
          </Rect>
          
          {/* Animated Glow 2 */}
          <Rect x={0} y={0} width={width} height={height}>
            <RadialGradient
              c={center2}
              r={radius * 0.8}
              colors={[`${accentColor}B3`, `${accentColor}00`]} // B3 is 70% opacity
            />
          </Rect>
        </Mask>
      </Canvas>
    </View>
  );
}

// ─── Pre-built variants ──────────────────────────────────────────────────────

export function ImageSkeletonSquare({
  size = 200,
  ...props
}: Omit<ImageSkeletonProps, 'width' | 'height'> & { size?: number }) {
  return <ImageSkeleton width={size} height={size} borderRadius={16} {...props} />;
}

export function ImageSkeletonWide({
  width = 340,
  height = 200,
  ...props
}: Partial<ImageSkeletonProps>) {
  return <ImageSkeleton width={width} height={height} borderRadius={12} {...props} />;
}

export function ImageSkeletonLight({
  width = 300,
  height = 300,
  ...props
}: Partial<ImageSkeletonProps>) {
  return (
    <ImageSkeleton
      width={width}
      height={height}
      baseColor="#F5F5F5"
      dotColor="#000000"
      accentColor="#000000"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
