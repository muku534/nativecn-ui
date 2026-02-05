import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const wp = (percentage: number) => (percentage * SCREEN_WIDTH) / 100;
const hp = (percentage: number) => (percentage * SCREEN_HEIGHT) / 100;

// Default Constants
const DEFAULT_COLORS = {
    white: '#FFFFFF',
    darkgray: '#374151',
    WhiteSmoke: '#F5F5F5',
    LightGray: '#E5E7EB',
    BrightPink: '#FF0080',
    black: '#000000',
    Midgray: '#9CA3AF',
};

const fontFamily = {
    FONTS: {
        bold: 'System',
        Medium: 'System',
        Regular: 'System'
    }
};

const ITEM_HEIGHT = 50;

interface DatePickerProps {
    visible: boolean;
    onClose: () => void;
    onDateSelect: (date: Date) => void;
    initialDate?: Date;
    minimumDate?: Date;
    maximumDate?: Date;
}

const DatePicker = ({
    visible,
    onClose,
    onDateSelect,
    initialDate,
    minimumDate,
    maximumDate,
}: DatePickerProps) => {
    const COLORS = DEFAULT_COLORS;
    const [selectedDate, setSelectedDate] = useState(initialDate || new Date());

    const monthScrollRef = useRef<any>(null);
    const dayScrollRef = useRef<any>(null);
    const yearScrollRef = useRef<any>(null);

    const isProgrammaticScroll = useRef(false);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentYearVal = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYearVal - i);

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const currentDay = selectedDate.getDate();

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const isDateDisabled = (month: number, day: number, year: number) => {
        const date = new Date(year, month, day);

        if (minimumDate) {
            const minDate = new Date(minimumDate);
            minDate.setHours(0, 0, 0, 0);
            if (date < minDate) return true;
        }

        if (maximumDate) {
            const maxDate = new Date(maximumDate);
            maxDate.setHours(0, 0, 0, 0);
            if (date > maxDate) return true;
        }

        return false;
    };

    const handleMonthChange = (monthIndex: number) => {
        const maxDay = getDaysInMonth(monthIndex, currentYear);
        const day = Math.min(currentDay, maxDay);
        setSelectedDate(new Date(currentYear, monthIndex, day));
    };

    const handleDayChange = (day: number) => {
        setSelectedDate(new Date(currentYear, currentMonth, day));
    };

    const handleYearChange = (year: number) => {
        const maxDay = getDaysInMonth(currentMonth, year);
        const day = Math.min(currentDay, maxDay);
        setSelectedDate(new Date(year, currentMonth, day));
    };

    const handleConfirm = () => {
        if (!isDateDisabled(currentMonth, currentDay, currentYear)) {
            onDateSelect(selectedDate);
            onClose();
        }
    };

    // 👉 Only scroll when modal opens
    useEffect(() => {
        if (!visible) return;

        isProgrammaticScroll.current = true;

        setTimeout(() => {
            if (monthScrollRef.current) {
                // @ts-ignore
                monthScrollRef.current.scrollTo({ y: currentMonth * ITEM_HEIGHT, animated: false });
            }
            if (dayScrollRef.current) {
                // @ts-ignore
                dayScrollRef.current.scrollTo({ y: (currentDay - 1) * ITEM_HEIGHT, animated: false });
            }

            const yearIndex = years.findIndex(y => y === currentYear);
            if (yearIndex >= 0 && yearScrollRef.current) {
                // @ts-ignore
                yearScrollRef.current.scrollTo({ y: yearIndex * ITEM_HEIGHT, animated: false });
            }

            setTimeout(() => {
                isProgrammaticScroll.current = false;
            }, 120);

        }, 150);

    }, [visible]);

    const handleMonthScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (isProgrammaticScroll.current) return;

        const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
        if (index >= 0 && index < months.length && index !== currentMonth) {
            handleMonthChange(index);
        }
    };

    const handleDayScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (isProgrammaticScroll.current) return;

        const day = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT) + 1;
        if (day >= 1 && day <= days.length && day !== currentDay) {
            handleDayChange(day);
        }
    };

    const handleYearScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (isProgrammaticScroll.current) return;

        const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
        if (index >= 0 && index < years.length && years[index] !== currentYear) {
            handleYearChange(years[index]);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContainer, { backgroundColor: COLORS.WhiteSmoke }]}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.headerTitle, { color: COLORS.darkgray }]}>Select Date</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={wp(6)} color={COLORS.darkgray} />
                        </TouchableOpacity>
                    </View>

                    {/* Picker */}
                    <View style={styles.pickerContainer}>
                        <View style={[styles.selectionHighlight, { backgroundColor: COLORS.white }]} />

                        {/* Month */}
                        <View style={styles.pickerColumn}>
                            <ScrollView
                                ref={monthScrollRef}
                                showsVerticalScrollIndicator={false}
                                snapToInterval={ITEM_HEIGHT}
                                decelerationRate="fast"
                                onMomentumScrollEnd={handleMonthScroll}
                            >
                                <View style={{ height: ITEM_HEIGHT * 2 }} />
                                {months.map((m, i) => {
                                    const disabled = isDateDisabled(i, currentDay, currentYear);
                                    return (
                                        <View key={m} style={styles.pickerItem}>
                                            <Text style={[
                                                styles.pickerText,
                                                { color: COLORS.darkgray },
                                                i === currentMonth && styles.selectedText && { color: COLORS.black },
                                                disabled && styles.disabledText
                                            ]}>
                                                {m}
                                            </Text>
                                        </View>
                                    );
                                })}
                                <View style={{ height: ITEM_HEIGHT * 2 }} />
                            </ScrollView>
                        </View>

                        {/* Day */}
                        <View style={styles.pickerColumn}>
                            <ScrollView
                                ref={dayScrollRef}
                                showsVerticalScrollIndicator={false}
                                snapToInterval={ITEM_HEIGHT}
                                decelerationRate="fast"
                                onMomentumScrollEnd={handleDayScroll}
                            >
                                <View style={{ height: ITEM_HEIGHT * 2 }} />
                                {days.map(d => {
                                    const disabled = isDateDisabled(currentMonth, d, currentYear);
                                    return (
                                        <View key={d} style={styles.pickerItem}>
                                            <Text style={[
                                                styles.pickerText,
                                                { color: COLORS.darkgray },
                                                d === currentDay && styles.selectedText && { color: COLORS.black },
                                                disabled && styles.disabledText
                                            ]}>
                                                {d}
                                            </Text>
                                        </View>
                                    );
                                })}
                                <View style={{ height: ITEM_HEIGHT * 2 }} />
                            </ScrollView>
                        </View>

                        {/* Year */}
                        <View style={styles.pickerColumn}>
                            <ScrollView
                                ref={yearScrollRef}
                                showsVerticalScrollIndicator={false}
                                snapToInterval={ITEM_HEIGHT}
                                decelerationRate="fast"
                                onMomentumScrollEnd={handleYearScroll}
                            >
                                <View style={{ height: ITEM_HEIGHT * 2 }} />
                                {years.map(y => {
                                    const disabled = isDateDisabled(currentMonth, currentDay, y);
                                    return (
                                        <View key={y} style={styles.pickerItem}>
                                            <Text style={[
                                                styles.pickerText,
                                                { color: COLORS.darkgray },
                                                y === currentYear && styles.selectedText && { color: COLORS.black },
                                                disabled && styles.disabledText
                                            ]}>
                                                {y}
                                            </Text>
                                        </View>
                                    );
                                })}
                                <View style={{ height: ITEM_HEIGHT * 2 }} />
                            </ScrollView>
                        </View>

                    </View>

                    {/* Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.LightGray }]} onPress={onClose}>
                            <Text style={[styles.buttonText, { color: COLORS.darkgray }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                { backgroundColor: COLORS.BrightPink },
                                isDateDisabled(currentMonth, currentDay, currentYear) && { opacity: 0.5 }
                            ]}
                            onPress={handleConfirm}
                            disabled={isDateDisabled(currentMonth, currentDay, currentYear)}
                        >
                            <Text style={[styles.buttonText, { color: COLORS.white }]}>Confirm</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: wp(95),
        borderRadius: wp(4),
        padding: wp(4),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(2),
    },
    headerTitle: {
        fontSize: hp(2.5),
        fontFamily: fontFamily.FONTS.bold,
    },
    pickerContainer: {
        flexDirection: 'row',
        height: ITEM_HEIGHT * 5,
        overflow: 'hidden',
        marginBottom: hp(3),
    },
    selectionHighlight: {
        position: 'absolute',
        top: ITEM_HEIGHT * 2,
        left: 0,
        right: 0,
        height: ITEM_HEIGHT,
        borderRadius: wp(2),
    },
    pickerColumn: {
        flex: 1,
    },
    pickerItem: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerText: {
        fontSize: hp(2),
        fontFamily: fontFamily.FONTS.Medium,
    },
    selectedText: {
        fontSize: hp(2.3),
        fontFamily: fontFamily.FONTS.bold,
    },
    disabledText: {
        opacity: 0.3,
        textDecorationLine: 'line-through'
    },
    actionButtons: {
        flexDirection: 'row',
        gap: wp(2),
    },
    button: {
        flex: 1,
        paddingVertical: hp(1.5),
        borderRadius: wp(2),
        alignItems: 'center',
    },
    buttonText: {
        fontSize: hp(2),
        fontFamily: fontFamily.FONTS.bold,
    },
});

export default DatePicker;
