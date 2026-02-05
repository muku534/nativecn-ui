import React, { useRef, useState } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const wp = (percentage: number) => (percentage * SCREEN_WIDTH) / 100;
const hp = (percentage: number) => (percentage * SCREEN_HEIGHT) / 100;

const DEFAULT_COLORS = {
    BrightPink: '#FF0080',
    TomatoRed: '#FF6347',
    white: '#FFFFFF',
    darkgray: '#374151',
};

interface FloatingSpeedDialProps {
    showMapView?: boolean;
    setShowMapView?: (show: boolean) => void;
    onAddFriends?: () => void;
    onAddDocument?: () => void;
}

const FloatingSpeedDial = ({
    showMapView = false,
    setShowMapView,
    onAddFriends,
    onAddDocument,
}: FloatingSpeedDialProps) => {
    const COLORS = DEFAULT_COLORS;
    const [showSpeedDial, setSpeedDial] = useState(false);
    const rotateAnim = useRef(new Animated.Value(0)).current;

    // Animations for actions
    const action1Anim = useRef(new Animated.Value(0)).current;
    const action2Anim = useRef(new Animated.Value(0)).current;
    const action3Anim = useRef(new Animated.Value(0)).current;

    const toggleSpeedDial = () => {
        const toValue = showSpeedDial ? 0 : 1;

        Animated.parallel([
            Animated.timing(rotateAnim, {
                toValue,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(action1Anim, {
                toValue,
                duration: 200,
                useNativeDriver: true,
                delay: showSpeedDial ? 100 : 0
            }),
            Animated.timing(action2Anim, {
                toValue,
                duration: 200,
                useNativeDriver: true,
                delay: 50
            }),
            Animated.timing(action3Anim, {
                toValue: toValue,
                duration: 200,
                useNativeDriver: true,
                delay: showSpeedDial ? 0 : 100
            })
        ]).start();

        setSpeedDial(!showSpeedDial);
    };

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg']
    });

    const getActionStyle = (anim: any, translateY: number) => ({
        opacity: anim,
        transform: [
            { scale: anim },
            {
                translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, translateY]
                })
            }
        ]
    });

    return (
        <View style={styles.container}>
            {/* Action 3: Switch View */}
            {setShowMapView && (
                <Animated.View style={[styles.actionBtnContainer, getActionStyle(action3Anim, -20)]}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.actionLabel}>{showMapView ? "List View" : "Map View"}</Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            toggleSpeedDial();
                            setShowMapView(!showMapView);
                        }}
                        style={[styles.actionBtn, { backgroundColor: COLORS.white }]}
                    >
                        <FontAwesome
                            name={showMapView ? "list-ul" : "map-o"}
                            size={hp(2.5)}
                            color={COLORS.darkgray}
                        />
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* Action 2: Add Friends */}
            {onAddFriends && (
                <Animated.View style={[styles.actionBtnContainer, getActionStyle(action2Anim, -10)]}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.actionLabel}>Add Friends</Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            toggleSpeedDial();
                            onAddFriends();
                        }}
                        style={[styles.actionBtn, { backgroundColor: COLORS.white }]}
                    >
                        <FontAwesome name="user-plus" size={hp(2.5)} color={COLORS.darkgray} />
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* Action 1: Add Document */}
            {onAddDocument && (
                <Animated.View style={[styles.actionBtnContainer, getActionStyle(action1Anim, 0)]}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.actionLabel}>Upload Doc</Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            toggleSpeedDial();
                            onAddDocument();
                        }}
                        style={[styles.actionBtn, { backgroundColor: COLORS.white }]}
                    >
                        <Entypo name="text-document" size={hp(2.5)} color={COLORS.darkgray} />
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* Main FAB */}
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={toggleSpeedDial}
                style={styles.mainFabContainer}
            >
                <LinearGradient
                    colors={[COLORS.BrightPink, COLORS.TomatoRed]}
                    style={styles.mainFab}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Animated.View style={{ transform: [{ rotate }] }}>
                        <Entypo name="plus" size={hp(4)} color={COLORS.white} />
                    </Animated.View>
                </LinearGradient>
            </TouchableOpacity>

            {/* Backdop when open */}
            {showSpeedDial && (
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={toggleSpeedDial}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: hp(12),
        right: wp(5),
        alignItems: 'flex-end',
        zIndex: 100,
    },
    mainFabContainer: {
        zIndex: 101,
    },
    mainFab: {
        width: wp(14),
        height: wp(14),
        borderRadius: wp(7),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    actionBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(2),
        marginRight: wp(1),
        zIndex: 101,
    },
    actionBtn: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    labelContainer: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingVertical: hp(0.5),
        paddingHorizontal: wp(2),
        borderRadius: wp(1),
        marginRight: wp(2),
    },
    actionLabel: {
        color: 'white',
        fontSize: hp(1.5),
        fontWeight: '600',
    },
    backdrop: {
        position: 'absolute',
        top: -SCREEN_HEIGHT,
        bottom: -hp(10),
        left: -SCREEN_WIDTH,
        right: -wp(10),
        backgroundColor: 'rgba(255,255,255,0.01)',
        zIndex: 90,
    }
});

export default FloatingSpeedDial;
