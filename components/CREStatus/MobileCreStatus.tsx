import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useGetSingleLeadQuery } from '@/features/slices/conversation/ConversationAPI';

interface MobileCreStatusProps {
    currentStatus: string;
    leadId: string;
}

const MobileCreStatus: React.FC<MobileCreStatusProps> = ({ currentStatus, leadId }) => {

    // console.log("MobileCreStatus screen leadId", leadId);
    const { data: lead } = useGetSingleLeadQuery(typeof leadId === 'string' ? leadId : '');

    // Local state for status and dropdown
    const [status, setStatus] = useState(currentStatus);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownValue, setDropdownValue] = useState(currentStatus);
    const [dropdownItems, setDropdownItems] = useState([
        { label: 'New', value: 'New' },
        { label: 'No Response', value: 'No Response' },
        { label: 'Message Rescheduled', value: 'Message Rescheduled' },
        { label: 'Number Collected', value: 'Number Collected' },
        { label: 'Call Reschedule', value: 'Call Reschedule' },
        { label: 'Ongoing', value: 'Ongoing' },
        { label: 'Close', value: 'Close' },
        { label: 'Meeting Fixed', value: 'Meeting Fixed' },
    ]);

    useEffect(() => {
        setStatus(currentStatus);
        setDropdownValue(currentStatus);
    }, [currentStatus]);

    const handleStatusChange = (value: string) => {
        setDropdownValue(value);
        setStatus(value);

        // If the user selects "Meeting Fixed", navigate to the meeting form route
        if (value === 'Meeting Fixed') {
            router.push(`/meeting-fix/address?leadId=${leadId}`);
        }
        // Add any additional logic here when status changes.

    };

    return (
        <View style={{ zIndex: 1000 }}>
            <DropDownPicker
                open={dropdownOpen}
                value={dropdownValue}
                items={dropdownItems}
                setOpen={setDropdownOpen}
                setValue={(callback) => {
                    const newValue = callback(dropdownValue);
                    handleStatusChange(newValue);
                }}
                setItems={setDropdownItems}
                containerStyle={{ width: 120 }}
                style={{ backgroundColor: '#046289' }}
                textStyle={{ color: 'white' }}
                dropDownContainerStyle={{ backgroundColor: '#046289', maxHeight: 600 }}
            />
        </View>
    );
};

export default MobileCreStatus;
