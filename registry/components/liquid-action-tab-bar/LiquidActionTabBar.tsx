import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface TabItem {
  id: string;
  label: string;
  iconName: 'home' | 'inbox' | 'bell' | 'layers';
}

export interface ActionMenuItem {
  id: string;
  label: string;
  iconSymbol: string;
  onPress?: () => void;
}

export interface LiquidActionTabBarProps {
  tabs?: TabItem[];
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  actions?: ActionMenuItem[];
  isDarkMode?: boolean;
  accentColor?: string;
}

// ─── DEFAULT DATA ────────────────────────────────────────────────────────────

const DEFAULT_TABS: TabItem[] = [
  { id: 'home', label: 'Home', iconName: 'home' },
  { id: 'inbox', label: 'Vault', iconName: 'inbox' },
  { id: 'notifications', label: 'Alerts', iconName: 'bell' },
  { id: 'layers', label: 'Feed', iconName: 'layers' },
];

const DEFAULT_ACTIONS: ActionMenuItem[] = [
  { id: 'trim', label: 'Trim', iconSymbol: '✂️' },
  { id: 'crop', label: 'Crop', iconSymbol: '⧉' },
  { id: 'enhance', label: 'Enhance', iconSymbol: '✨' },
  { id: 'text', label: 'Text', iconSymbol: 'Aa' },
  { id: 'audio', label: 'Audio', iconSymbol: '🎵' },
  { id: 'speed', label: 'Speed', iconSymbol: '🐇' },
  { id: 'duplicate', label: 'Duplicate', iconSymbol: '❐' },
  { id: 'undo', label: 'Undo', iconSymbol: '↩' },
  { id: 'share', label: 'Share', iconSymbol: '⎘' },
  { id: 'save', label: 'Save', iconSymbol: '🔖' },
  { id: 'delete', label: 'Delete', iconSymbol: '🗑' },
];

// ─── SPRING CONFIGS ──────────────────────────────────────────────────────────

const MORPH_SPRING = {
  damping: 18,
  stiffness: 200,
  mass: 0.8,
};

const FAB_SPRING = {
  damping: 15,
  stiffness: 280,
};

// ─── VECTOR ICON COMPONENT ───────────────────────────────────────────────────

function VectorIcon({
  name,
  color,
  size = 22,
}: {
  name: TabItem['iconName'];
  color: string;
  size?: number;
}) {
  if (name === 'home') {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            width: size * 0.7,
            height: size * 0.7,
            borderTopWidth: 2,
            borderLeftWidth: 2,
            borderColor: color,
            transform: [{ rotate: '45deg' }],
            position: 'absolute',
            top: 1,
          }}
        />
        <View
          style={{
            width: size * 0.6,
            height: size * 0.5,
            borderWidth: 2,
            borderTopWidth: 0,
            borderColor: color,
            position: 'absolute',
            bottom: 2,
            borderRadius: 2,
          }}
        />
      </View>
    );
  }

  if (name === 'inbox') {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            width: size * 0.8,
            height: size * 0.65,
            borderWidth: 2,
            borderColor: color,
            borderRadius: 4,
            justifyContent: 'flex-start',
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: '100%',
              height: 4,
              borderBottomWidth: 2,
              borderColor: color,
            }}
          />
        </View>
      </View>
    );
  }

  if (name === 'bell') {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            width: size * 0.6,
            height: size * 0.65,
            borderWidth: 2,
            borderColor: color,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 3,
            borderBottomRightRadius: 3,
          }}
        />
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: color,
            marginTop: 2,
          }}
        />
      </View>
    );
  }

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: size * 0.7,
          height: size * 0.4,
          borderWidth: 2,
          borderColor: color,
          borderRadius: 3,
          transform: [{ rotate: '-12deg' }],
          position: 'absolute',
          top: 2,
        }}
      />
      <View
        style={{
          width: size * 0.7,
          height: size * 0.4,
          borderWidth: 2,
          borderColor: color,
          borderRadius: 3,
          backgroundColor: '#FFFFFF',
          transform: [{ rotate: '0deg' }],
          position: 'absolute',
          bottom: 3,
        }}
      />
    </View>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export function LiquidActionTabBar({
  tabs = DEFAULT_TABS,
  activeTabId = 'home',
  onTabChange,
  actions = DEFAULT_ACTIONS,
  isDarkMode = false,
  accentColor = '#000000',
}: LiquidActionTabBarProps) {
  const [selectedTab, setSelectedTab] = useState(activeTabId);
  const [isExpanded, setIsExpanded] = useState(false);

  const activeIndexAnim = useSharedValue(
    tabs.findIndex((t) => t.id === activeTabId) >= 0
      ? tabs.findIndex((t) => t.id === activeTabId)
      : 0
  );
  const expandAnim = useSharedValue(0);
  const fabRotation = useSharedValue(0);

  const cardBg = isDarkMode ? '#18181B' : '#FFFFFF';
  const borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)';
  const fabBg = isDarkMode ? '#FFFFFF' : '#18181B';
  const fabIconColor = isDarkMode ? '#18181B' : '#FFFFFF';
  const itemBoxBg = isDarkMode ? '#27272A' : '#F4F4F5';
  const textColor = isDarkMode ? '#F4F4F5' : '#18181B';
  const subTextColor = isDarkMode ? '#A1A1AA' : '#71717A';

  const FAB_SIZE = 56;
  const COLLAPSED_WIDTH = SCREEN_WIDTH * 0.73;
  const EXPANDED_WIDTH = SCREEN_WIDTH - 96;
  const COLLAPSED_HEIGHT = 60;
  
  const numRows = Math.ceil((actions?.length || 0) / 4);
  const ROW_HEIGHT = 82;
  const EXPANDED_HEIGHT = Math.max(200, 24 + numRows * ROW_HEIGHT + 12);

  const TAB_WIDTH = (COLLAPSED_WIDTH - 12) / (tabs?.length || 1);

  const handleTabPress = (tabId: string, index: number) => {
    setSelectedTab(tabId);
    activeIndexAnim.value = withSpring(index, MORPH_SPRING);
    onTabChange?.(tabId);
  };

  const toggleExpand = useCallback(() => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);

    if (nextState) {
      expandAnim.value = withSpring(1, MORPH_SPRING);
      fabRotation.value = withSpring(45, FAB_SPRING);
    } else {
      expandAnim.value = withSpring(0, MORPH_SPRING);
      fabRotation.value = withSpring(0, FAB_SPRING);
    }
  }, [isExpanded]);

  const handleActionPress = (action: ActionMenuItem) => {
    action.onPress?.();
    toggleExpand();
  };

  const leftCardStyle = useAnimatedStyle(() => {
    const width = interpolate(
      expandAnim.value,
      [0, 1],
      [COLLAPSED_WIDTH, EXPANDED_WIDTH],
      Extrapolation.CLAMP
    );
    const height = interpolate(
      expandAnim.value,
      [0, 1],
      [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
      Extrapolation.CLAMP
    );
    const borderRadius = interpolate(
      expandAnim.value,
      [0, 1],
      [30, 26],
      Extrapolation.CLAMP
    );
    const translateX = interpolate(
      expandAnim.value,
      [0, 1],
      [0, -4],
      Extrapolation.CLAMP
    );

    return {
      width,
      height,
      borderRadius,
      transform: [{ translateX }],
    };
  });

  const tabsAreaStyle = useAnimatedStyle(() => {
    const opacity = interpolate(expandAnim.value, [0, 0.4], [1, 0], Extrapolation.CLAMP);
    return {
      opacity,
      pointerEvents: expandAnim.value < 0.2 ? 'auto' : 'none',
    };
  });

  const actionGridStyle = useAnimatedStyle(() => {
    const opacity = interpolate(expandAnim.value, [0.3, 1], [0, 1], Extrapolation.CLAMP);
    const scale = interpolate(expandAnim.value, [0, 1], [0.92, 1], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ scale }],
      height: EXPANDED_HEIGHT,
      pointerEvents: expandAnim.value > 0.5 ? 'auto' : 'none',
    };
  });

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: activeIndexAnim.value * TAB_WIDTH,
        },
      ],
    };
  });

  const fabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${fabRotation.value}deg` }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: expandAnim.value,
      pointerEvents: expandAnim.value > 0.1 ? 'auto' : 'none',
    };
  });

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={toggleExpand} />
      </Animated.View>

      <View style={styles.bottomRow} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.leftContainer,
            { backgroundColor: cardBg, borderColor },
            leftCardStyle,
          ]}
        >
          <Animated.View style={[styles.tabsInnerContainer, tabsAreaStyle]}>
            <Animated.View
              style={[
                styles.activeIndicator,
                {
                  width: TAB_WIDTH,
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.06)',
                },
                indicatorStyle,
              ]}
            />
            {tabs.map((tab, idx) => {
              const isSelected = selectedTab === tab.id;
              const activeColor = isSelected ? (isDarkMode ? '#FFFFFF' : accentColor) : subTextColor;

              return (
                <TouchableOpacity
                  key={tab.id}
                  activeOpacity={0.8}
                  onPress={() => handleTabPress(tab.id, idx)}
                  style={styles.tabButton}
                >
                  <VectorIcon name={tab.iconName} color={activeColor} size={20} />
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          <Animated.View style={[styles.gridContainer, actionGridStyle]}>
            <View style={styles.menuGrid}>
              {actions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  onPress={() => handleActionPress(item)}
                  style={styles.gridItem}
                >
                  <View style={[styles.iconBox, { backgroundColor: itemBoxBg }]}>
                    <Text style={styles.iconSymbolText}>{item.iconSymbol}</Text>
                  </View>
                  <Text style={[styles.gridLabel, { color: textColor }]} numberOfLines={1}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </Animated.View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={toggleExpand}
          style={[
            styles.fabButton,
            {
              width: FAB_SIZE,
              height: FAB_SIZE,
              borderRadius: FAB_SIZE / 2,
              backgroundColor: fabBg,
              borderColor,
            },
          ]}
        >
          <Animated.View style={[styles.fabIconWrapper, fabAnimatedStyle]}>
            <Text style={[styles.fabPlusText, { color: fabIconColor }]}>+</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bottomRow: {
    width: SCREEN_WIDTH - 32,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  leftContainer: {
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 18,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  tabsInnerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  activeIndicator: {
    position: 'absolute',
    left: 6,
    height: 48,
    borderRadius: 24,
    top: '50%',
    marginTop: -24, 
  },
  tabButton: {
    flex: 1,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: 24,
    justifyContent: 'flex-start',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  gridItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconSymbolText: {
    fontSize: 20,
  },
  gridLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  fabButton: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  fabIconWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabPlusText: {
    fontSize: 28,
    fontWeight: '300',
    marginTop: -2,
  },
});
