// app/meeting-set/fix-meeting.tsx
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { View, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { useGetAllActiveTimeSlotsQuery } from '@/features/meetings/timeSlotAPI';
import { useGetUserByDepartmentAndRoleQuery } from '@/features/slices/auth/AuthAPI';
import { useGetMeetingByDateRangeQuery } from '@/features/meetings/meetinApi';
import { MeetingContext } from './MeetingContext';



interface FixMeetingProps {
    selectedLeadId: string;
}

export default function FixNew({ selectedLeadId }: FixMeetingProps) {

    const router = useRouter();
    const { leadId } = useLocalSearchParams();
    const { meetingData, setMeetingData } = useContext(MeetingContext);

    // State for meeting date
    const [meetingDate, setMeetingDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Sales Executive dropdown states
    const [selectedSalesExecutive, setSelectedSalesExecutive] = useState<string | null>(null);
    const [salesDropdownOpen, setSalesDropdownOpen] = useState(false);
    const [salesDropdownItems, setSalesDropdownItems] = useState<{ label: string; value: string }[]>([]);

    // Time Slot dropdown states
    const [activeTimeSlot, setActiveTimeSlot] = useState<string | null>(null);
    const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
    const [timeDropdownItems, setTimeDropdownItems] = useState<{ label: string; value: string }[]>([]);

    // Format the meeting date for queries (YYYY-MM-DD)
    const formattedDate = moment(meetingDate).format('YYYY-MM-DD');

    // Fetch all active time slots
    const { data: timeSlotsData } = useGetAllActiveTimeSlotsQuery();

    // Fetch sales executives (from Sales department)
    const { data: salesData } = useGetUserByDepartmentAndRoleQuery({
        departmentName: 'Sales',
    });

    // Fetch meetings for the selected date
    const { data: meetingsData } = useGetMeetingByDateRangeQuery(
        { startDate: formattedDate, endDate: formattedDate },
        { skip: !formattedDate }
    );

    // Populate sales executive dropdown items and auto-select first if not selected
    useEffect(() => {
        if (salesData) {
            const items = salesData.map((sales: any) => ({
                label: sales.nickname || sales.name,
                value: sales._id,
            }));
            setSalesDropdownItems(items);
            if (!selectedSalesExecutive && items.length > 0) {
                setSelectedSalesExecutive(items[0].value);
            }
        }
    }, [salesData]);

    // Filter time slots based on selected sales executive and booked meetings
    const availableTimeSlots = useMemo(() => {
        if (!timeSlotsData) return [];
        if (meetingsData && selectedSalesExecutive) {
            // Get booked slots for the selected sales executive
            const bookedMeetings = meetingsData.filter(
                (m: any) => m.salesExecutive?._id === selectedSalesExecutive
            );
            // Filter timeSlotsData: exclude any slot that is within <= 1 hour of any booked meeting slot
            return timeSlotsData.filter((slot: any) => {
                const candidateTime = moment(`${formattedDate} ${slot.slot}`, "YYYY-MM-DD h:mm A");
                for (let booked of bookedMeetings) {
                    const bookedTime = moment(`${formattedDate} ${booked.slot}`, "YYYY-MM-DD h:mm A");
                    const diff = Math.abs(candidateTime.diff(bookedTime, 'hours', true));
                    if (diff <= 1) {
                        return false;
                    }
                }
                return true;
            });
        }
        return timeSlotsData;
    }, [timeSlotsData, meetingsData, selectedSalesExecutive, meetingDate, formattedDate]);

    // Populate time slot dropdown items based on availableTimeSlots
    useEffect(() => {
        const items = availableTimeSlots.map((slot: any) => ({
            label: slot.slot || slot,
            value: slot.slot || slot,
        }));
        setTimeDropdownItems(items);
    }, [availableTimeSlots]);

    // Handler for date changes
    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setMeetingDate(selectedDate);
        }
    };

    // Save handler with required field validation and update MeetingContext
    const handleSave = () => {
        if (!meetingDate || !selectedSalesExecutive || !activeTimeSlot) {
            Alert.alert("Input field is empty", "Please fill out all fields. Please try again.");
            return;
        }
        // Save meeting details in context
        setMeetingData(prev => ({
            ...prev,
            date: moment(meetingDate).format('YYYY-MM-DD'),
            slot: activeTimeSlot,
            salesExecutive: selectedSalesExecutive,
        }));
        console.log('Meeting Date:', moment(meetingDate).format('MM/DD/YYYY'));
        console.log('Selected Sales Executive:', selectedSalesExecutive);
        console.log('Active Time Slot:', activeTimeSlot);
        // Navigate to the next screen (e.g., project info screen)
        router.push(`/meeting-fix/project-info?leadId=${leadId}`);
    };

    return (
        <View className="flex-1 bg-white p-6 justify-center">
            <Text className="text-xl font-bold mb-6 text-center text-gray-500">
                Select Slot and Executives
            </Text>

            {/* Date Picker */}
            <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="border border-gray-200 p-4 mb-6 rounded"
            >
                <View className="flex-row items-center justify-center">
                    <Ionicons name="calendar-outline" size={24} color="#6b7280" />
                    <Text className="text-center text-gray-500 flex-1">
                        Select Meeting Date: {moment(meetingDate).format('MM/DD/YYYY')}
                    </Text>
                </View>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={meetingDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            {/* Sales Executive Dropdown */}
            <DropDownPicker
                open={salesDropdownOpen}
                value={selectedSalesExecutive}
                items={salesDropdownItems}
                setOpen={setSalesDropdownOpen}
                setValue={setSelectedSalesExecutive}
                setItems={setSalesDropdownItems}
                dropDownDirection="TOP"
                listMode="SCROLLVIEW"
                placeholder="Select Sales Executive"
                containerStyle={{ width: '100%', marginBottom: 24 }}
                style={{ backgroundColor: '#f0f0f0', borderColor: '#e5e7eb' }}
                textStyle={{ color: '#6b7280' }}
                dropDownContainerStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', maxHeight: 150 }}
            />

            {/* Time Slot Dropdown */}
            <DropDownPicker
                open={timeDropdownOpen}
                value={activeTimeSlot}
                items={timeDropdownItems}
                setOpen={setTimeDropdownOpen}
                setValue={setActiveTimeSlot}
                setItems={setTimeDropdownItems}
                placeholder="Select Active Time Slot"
                listMode="SCROLLVIEW"
                containerStyle={{ width: '100%', marginBottom: 24 }}
                style={{ backgroundColor: '#f0f0f0', borderColor: '#e5e7eb' }}
                textStyle={{ color: '#6b7280' }}
                dropDownContainerStyle={{
                    backgroundColor: '#fff',
                    borderColor: '#e5e7eb',
                    zIndex: 2000,
                    maxHeight: 150,
                }}
            />

            <TouchableOpacity
                onPress={handleSave}
                className="bg-[#046289] py-3 px-6 rounded-lg"
            >
                <Text className="text-white font-bold text-center">Save</Text>
            </TouchableOpacity>
        </View>
    );
}
