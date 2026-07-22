import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  useDerivedValue,
  runOnJS,
  useAnimatedRef,
} from 'react-native-reanimated';

// ─── DATA GENERATION ────────────────────────────────────────────────────────

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;

const TIMES = Array.from({ length: 48 }, (_, i) => {
  const totalMinutes = i * 30;
  const h24 = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  const ampm = h24 < 12 ? 'am' : 'pm';
  return {
    id: `time-${i}`,
    label: `${h12}:${m === 0 ? '00' : m} ${ampm}`,
    index: i,
  };
});

// ─── ICONS ──────────────────────────────────────────────────────────────────

function ClockIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 1.5,
          height: size * 0.25,
          backgroundColor: color,
          position: 'absolute',
          top: size * 0.15,
          borderRadius: 1,
        }}
      />
      <View
        style={{
          width: size * 0.2,
          height: 1.5,
          backgroundColor: color,
          position: 'absolute',
          top: size * 0.4,
          left: size * 0.4,
          borderRadius: 1,
        }}
      />
    </View>
  );
}

// ─── SUBCOMPONENTS ──────────────────────────────────────────────────────────

interface TimeItemProps {
  item: typeof TIMES[0];
  index: number;
  activeIndexContinuous: any;
  textPrimary: string;
}

const TimeItem = ({ item, index, activeIndexContinuous, textPrimary }: TimeItemProps) => {
  const itemStyle = useAnimatedStyle(() => {
    const distance = Math.abs(activeIndexContinuous.value - index);
    const scale = interpolate(distance, [0, 1, 2], [1.1, 0.9, 0.8], Extrapolation.CLAMP);
    const opacity = interpolate(distance, [0, 1, 2], [1, 0.5, 0.2], Extrapolation.CLAMP);
    return { transform: [{ scale }], opacity };
  });

  return (
    <Animated.View style={[styles.timeItem, itemStyle]}>
      <Text style={[styles.timeText, { color: textPrimary }]}>{item.label}</Text>
    </Animated.View>
  );
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export interface TimePickerProps {
  isDarkMode?: boolean;
  initialIndex?: number;
  onTimeChange?: (start: string, end?: string) => void;
}

export default function TimePicker({
  isDarkMode = true,
  initialIndex = 38, // Default 7:00 pm
  onTimeChange,
}: TimePickerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectionMode, setSelectionMode] = useState<'single' | 'range'>('single');
  
  const [startLabel, setStartLabel] = useState(TIMES[initialIndex].label);
  const [endLabel, setEndLabel] = useState(TIMES[initialIndex + 2]?.label || TIMES[initialIndex].label);

  // Layout Widths
  const [segmentWidth, setSegmentWidth] = useState(0);

  // Animations
  const expandAnim = useSharedValue(0);
  const rangeAnim = useSharedValue(0);
  
  // Scroll Values
  const scrollYStart = useSharedValue(initialIndex * ITEM_HEIGHT);
  const scrollYEnd = useSharedValue((initialIndex + 2) * ITEM_HEIGHT);
  const scrollViewStartRef = useAnimatedRef<Animated.ScrollView>();
  const scrollViewEndRef = useAnimatedRef<Animated.ScrollView>();

  const bgPrimary = isDarkMode ? '#1C1C1E' : '#FFFFFF';
  const bgSecondary = isDarkMode ? '#2C2C2E' : '#F2F2F7';
  const textPrimary = isDarkMode ? '#FFFFFF' : '#000000';
  const textSecondary = isDarkMode ? '#8E8E93' : '#8E8E93';
  const accentColorStart = '#0A84FF'; // Blue
  const accentColorEnd = '#FF9F0A'; // Orange

  // Spring Configs
  const SPRING_CONFIG = {
    mass: 1,
    damping: 18,
    stiffness: 150,
  };

  // Handlers
  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => {
      const next = !prev;
      expandAnim.value = withSpring(next ? 1 : 0, SPRING_CONFIG);
      return next;
    });
  }, [expandAnim]);

  const toggleMode = useCallback((mode: 'single' | 'range') => {
    setSelectionMode(mode);
    rangeAnim.value = withSpring(mode === 'range' ? 1 : 0, SPRING_CONFIG);
  }, [rangeAnim]);

  // Scroll Handlers
  const onScrollStart = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollYStart.value = event.contentOffset.y;
    },
    onMomentumEnd: (event) => {
      const activeIdx = Math.round(event.contentOffset.y / ITEM_HEIGHT);
      if (TIMES[activeIdx]) {
        runOnJS(setStartLabel)(TIMES[activeIdx].label);
        if (onTimeChange) {
          runOnJS(onTimeChange)(TIMES[activeIdx].label, undefined);
        }
      }
    },
  });

  const onScrollEnd = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollYEnd.value = event.contentOffset.y;
    },
    onMomentumEnd: (event) => {
      const activeIdx = Math.round(event.contentOffset.y / ITEM_HEIGHT);
      if (TIMES[activeIdx]) {
        runOnJS(setEndLabel)(TIMES[activeIdx].label);
        if (onTimeChange) {
          runOnJS(onTimeChange)(startLabel, TIMES[activeIdx].label);
        }
      }
    },
  });

  // Effects
  useEffect(() => {
    setTimeout(() => {
      if (scrollViewStartRef.current) {
        scrollViewStartRef.current.scrollTo({ y: initialIndex * ITEM_HEIGHT, animated: false });
      }
      if (scrollViewEndRef.current) {
        scrollViewEndRef.current.scrollTo({ y: (initialIndex + 2) * ITEM_HEIGHT, animated: false });
      }
    }, 100);
  }, []);

  // Styles
  const containerStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(expandAnim.value, [0, 1], [64, 380], Extrapolation.CLAMP),
      backgroundColor: bgPrimary,
    };
  });

  const expandedContentStyle = useAnimatedStyle(() => {
    return {
      opacity: expandAnim.value,
      pointerEvents: expandAnim.value > 0.5 ? 'auto' : 'none',
      transform: [{ translateY: interpolate(expandAnim.value, [0, 1], [-20, 0], Extrapolation.CLAMP) }],
    };
  });

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: rangeAnim.value * (segmentWidth / 2) }],
    };
  });

  // Clock Hand Derived Values
  const activeIndexStart = useDerivedValue(() => scrollYStart.value / ITEM_HEIGHT);
  const activeIndexEnd = useDerivedValue(() => scrollYEnd.value / ITEM_HEIGHT);

  const getHandRotation = (continuousIndex: number, isHour: boolean) => {
    'worklet';
    const timeInMinutes = continuousIndex * 30;
    if (isHour) {
      const hour = (timeInMinutes / 60) % 12;
      return hour * 30;
    } else {
      const minute = timeInMinutes % 60;
      return minute * 6;
    }
  };

  const startHourHandStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${getHandRotation(activeIndexStart.value, true)}deg` }] }));
  const startMinuteHandStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${getHandRotation(activeIndexStart.value, false)}deg` }] }));
  const endHourHandStyle = useAnimatedStyle(() => ({
    opacity: rangeAnim.value,
    transform: [{ rotate: `${getHandRotation(activeIndexEnd.value, true)}deg` }]
  }));
  const endMinuteHandStyle = useAnimatedStyle(() => ({
    opacity: rangeAnim.value,
    transform: [{ rotate: `${getHandRotation(activeIndexEnd.value, false)}deg` }]
  }));

  const listContainerStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(rangeAnim.value, [0, 1], [130, 200]),
    };
  });

  const clockScaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(rangeAnim.value, [0, 1], [1, 0.85]) }],
    };
  });

  const endListStyle = useAnimatedStyle(() => {
    return {
      opacity: rangeAnim.value,
      width: interpolate(rangeAnim.value, [0, 1], [0, 90]),
      overflow: 'hidden',
    };
  });

  const startListStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(rangeAnim.value, [0, 1], [130, 90]),
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* HEADER */}
      <TouchableOpacity activeOpacity={0.7} onPress={toggleExpand} style={styles.header}>
        <View style={styles.headerLeft}>
          <ClockIcon color={textSecondary} size={20} />
          <Text style={[styles.headerTitle, { color: textSecondary }]}>Time</Text>
        </View>
        <Text style={[styles.headerValue, { color: textPrimary }]}>
          {selectionMode === 'single' ? startLabel : `${startLabel} - ${endLabel}`}
        </Text>
      </TouchableOpacity>

      {/* EXPANDED CONTENT */}
      <Animated.View style={[styles.expandedContent, expandedContentStyle]}>
        
        {/* SEGMENTED CONTROL */}
        <View 
          style={[styles.segmentedControl, { backgroundColor: bgSecondary }]}
          onLayout={(e) => setSegmentWidth(e.nativeEvent.layout.width)}
        >
          <Animated.View style={[styles.segmentIndicator, { backgroundColor: bgPrimary }, indicatorStyle]} />
          
          <Pressable style={styles.segment} onPress={() => toggleMode('single')}>
            {selectionMode === 'single' && (
              <View style={[styles.checkCircle, { backgroundColor: accentColorStart }]}>
                <View style={styles.checkIcon} />
              </View>
            )}
            <Text style={[styles.segmentText, { color: selectionMode === 'single' ? textPrimary : textSecondary }]}>Single time</Text>
          </Pressable>
          
          <Pressable style={styles.segment} onPress={() => toggleMode('range')}>
            {selectionMode === 'range' && (
              <View style={[styles.checkCircle, { backgroundColor: accentColorEnd }]}>
                <View style={styles.checkIcon} />
              </View>
            )}
            <Text style={[styles.segmentText, { color: selectionMode === 'range' ? textPrimary : textSecondary }]}>Time range</Text>
          </Pressable>
        </View>

        <View style={styles.mainRow}>
          
          {/* ANALOG CLOCK */}
          <View style={styles.clockContainer}>
            <Animated.View style={[styles.clockFace, { backgroundColor: bgSecondary }, clockScaleStyle]}>
              {Array.from({ length: 12 }).map((_, i) => (
                <View key={i} style={[styles.clockTickWrapper, { transform: [{ rotate: `${i * 30}deg` }] }]}>
                  <View style={[styles.clockTick, { backgroundColor: textSecondary }]} />
                </View>
              ))}

              {/* Start Hands */}
              <Animated.View style={[styles.handWrapper, startHourHandStyle]}>
                <View style={[styles.hourHand, { backgroundColor: textPrimary }]} />
              </Animated.View>
              <Animated.View style={[styles.handWrapper, startMinuteHandStyle]}>
                <View style={[styles.minuteHand, { backgroundColor: accentColorStart }]} />
                <View style={[styles.minuteDot, { backgroundColor: accentColorStart }]} />
              </Animated.View>

              {/* End Hands */}
              <Animated.View style={[styles.handWrapper, endHourHandStyle]}>
                <View style={[styles.hourHand, { backgroundColor: textSecondary, opacity: 0.6, width: 3.5, height: 32, top: 43 }]} />
              </Animated.View>
              <Animated.View style={[styles.handWrapper, endMinuteHandStyle]}>
                <View style={[styles.minuteHand, { backgroundColor: accentColorEnd, width: 2.5, height: 46, top: 29 }]} />
                <View style={[styles.minuteDot, { backgroundColor: accentColorEnd, width: 6, height: 6, top: 26 }]} />
              </Animated.View>

              <View style={[styles.centerDot, { backgroundColor: textPrimary }]} />
            </Animated.View>
          </View>

          {/* TIME LISTS */}
          <Animated.View style={[styles.listContainer, listContainerStyle]}>
            <View style={styles.activeHighlight} />
            
            {/* Start List */}
            <Animated.View style={startListStyle}>
              <Animated.ScrollView
                ref={scrollViewStartRef}
                onScroll={onScrollStart}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                disableIntervalMomentum={true}
                contentContainerStyle={{ paddingTop: ITEM_HEIGHT * 2, paddingBottom: ITEM_HEIGHT * 2 }}
              >
                {TIMES.map((item, i) => (
                  <TimeItem 
                    key={`start-${item.id}`} 
                    item={item} 
                    index={i} 
                    activeIndexContinuous={activeIndexStart} 
                    textPrimary={textPrimary} 
                  />
                ))}
              </Animated.ScrollView>
            </Animated.View>

            {/* End List */}
            <Animated.View style={endListStyle}>
              <Animated.ScrollView
                ref={scrollViewEndRef}
                onScroll={onScrollEnd}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                disableIntervalMomentum={true}
                contentContainerStyle={{ paddingTop: ITEM_HEIGHT * 2, paddingBottom: ITEM_HEIGHT * 2 }}
              >
                {TIMES.map((item, i) => (
                  <TimeItem 
                    key={`end-${item.id}`} 
                    item={item} 
                    index={i} 
                    activeIndexContinuous={activeIndexEnd} 
                    textPrimary={textPrimary} 
                  />
                ))}
              </Animated.ScrollView>
            </Animated.View>
          </Animated.View>

        </View>
      </Animated.View>
    </Animated.View>
  );
}

// ─── STYLES ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
      android: { elevation: 10 },
    }),
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 10,
  },
  headerValue: {
    fontSize: 17,
    fontWeight: '600',
  },
  expandedContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  segmentedControl: {
    flexDirection: 'row',
    height: 36,
    borderRadius: 18,
    padding: 2,
    marginBottom: 24,
    position: 'relative',
  },
  segmentIndicator: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    left: 2,
    width: '50%',
    borderRadius: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  checkCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: 0.5 }],
  },
  checkIcon: {
    width: 8,
    height: 5,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: '#FFF',
    transform: [{ rotate: '-45deg' }, { translateY: -1 }, { translateX: 0.5 }],
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
  },
  mainRow: {
    flexDirection: 'row',
    flex: 1,
  },
  clockContainer: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockFace: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  clockTickWrapper: {
    position: 'absolute',
    width: 150,
    height: 150,
    alignItems: 'center',
    paddingTop: 8,
  },
  clockTick: {
    width: 2,
    height: 6,
    borderRadius: 1,
    opacity: 0.3,
  },
  handWrapper: {
    position: 'absolute',
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourHand: {
    width: 4.5,
    height: 38,
    borderRadius: 2.5,
    position: 'absolute',
    top: 37,
  },
  minuteHand: {
    width: 3,
    height: 54,
    borderRadius: 1.5,
    position: 'absolute',
    top: 21,
  },
  minuteDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 17,
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
  },
  listContainer: {
    flexDirection: 'row',
    height: 220, 
    position: 'relative',
  },
  activeHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 8,
    right: 8,
    height: ITEM_HEIGHT,
    backgroundColor: 'rgba(150, 150, 150, 0.12)',
    borderRadius: 12,
  },
  timeItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
