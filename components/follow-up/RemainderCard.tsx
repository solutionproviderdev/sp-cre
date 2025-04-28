import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import call from 'react-native-phone-call';

// -- Type Declarations --

interface Address {
    address: string;
    area: string;
    district: string;
    division: string;
}

interface CREName {
    nameAsPerNID: string;
    profilePicture: string;
}

export interface Reminder {
    status: string;
    name: string;
    phone: string[];
    address?: Address;
    creName?: CREName;
}

export interface LatestReminder {
    status: string;
}

interface CommentBy {
    nameAsPerNID: string;
    profilePicture: string;
}

export interface LastComment {
    commentBy?: CommentBy;
    comment: string;
}

export interface ReminderCardProps {
    reminder: Reminder;
    latestReminder: LatestReminder;
    lastComment?: LastComment;
    formattedDate: string;
    formattedTime: string;
    commentTimestamp: string;
    getStatusColor: (status: string) => string;
    onCallInitiated?: () => void; // <-- new callback prop
}

// -- ReminderCard Component --

const ReminderCard: React.FC<ReminderCardProps> = ({
    reminder,
    latestReminder,
    lastComment,
    formattedDate,
    formattedTime,
    commentTimestamp,
    getStatusColor,
    onCallInitiated, // <-- added prop here
}) => {

    // Assuming reminder.phone is an array; choose the primary one
    const phoneNumber = reminder.phone?.[0];

    // Function to handle call button press
    const handleCallPress = () => {
        if (!phoneNumber) {
            Alert.alert('Error', 'No phone number available');
            return;
        }

        // Invoke parent callback before making the call
        if (onCallInitiated) {
            onCallInitiated();
        }

        // Arguments for react-native-phone-call
        const args = {
            number: phoneNumber, // string value of the phone number to call
            prompt: false,       // setting to false initiates the call immediately without showing the dialer
        };

        call(args)
            .then(() => console.log('Call initiated successfully'))
            .catch(err => {
                console.error('Failed to initiate call:', err);
                Alert.alert('Call error', 'Could not start the call');
            });
    };
    return (
        <View className="bg-white p-3 rounded-lg border border-gray-300 shadow space-y-3">
            {/* Header Section */}
            <View className="flex-row justify-between items-center mb-2">
                {/* Lead Status Chip */}
                <View style={{ borderColor: "#046289" }} className="px-2 py-1 border rounded-full">
                    <Text style={{ color: "#046289" }} className="text-sm">
                        {reminder.status}
                    </Text>
                </View>
                {/* Reminder Status Chip */}
                <View
                    className="px-2 py-1 rounded-full"
                    style={{ backgroundColor: getStatusColor(latestReminder.status) }}
                >
                    <Text className="text-sm text-white">{latestReminder.status}</Text>
                </View>
                {/* CRE Avatar */}
                <TouchableOpacity>
                    <Image
                        source={{
                            uri: reminder.creName?.profilePicture || 'https://via.placeholder.com/28',
                        }}
                        style={{ borderColor: "#046289" }}
                        className="w-7 h-7 rounded-full border-2"
                    />
                </TouchableOpacity>
            </View>

            {/* Name and Date/Time Row */}
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-bold">{reminder.name}</Text>
                <Text className="text-xs text-gray-500">{`${formattedDate} • ${formattedTime}`}</Text>
            </View>

            {/* Phone Information */}
            <View className="flex-row items-center mb-2">
                <Ionicons name="call" size={16} color="#046289" className="mr-1" />
                <Text className="text-sm">{(reminder.phone || []).join(', ')}</Text>
            </View>

            {/* Address Section */}
            {reminder.address && (
                <View className="flex-row items-center mb-2">
                    
                    <Ionicons name="home" size={16} color="#6B7280" className="mr-1" />
                    <Text className="text-sm">
                        {`${reminder.address.address}, ${reminder.address.area}, ${reminder.address.district}, ${reminder.address.division}`}
                    </Text>
                </View>
            )}

            {/* Divider */}
            <View className="border-b border-gray-300 my-2" />

            {/* Last Comment Section */}
            {lastComment && (
                <View className="mb-2">
                    <View className="flex-row items-center mb-1">
                        <Image
                            source={{
                                uri: lastComment.commentBy?.profilePicture || 'https://via.placeholder.com/24',
                            }}
                            className="w-6 h-6 rounded-full mr-2"
                        />
                        <Text className="text-sm font-bold">
                            {lastComment.commentBy?.nameAsPerNID}
                        </Text>
                        <Text className="text-xs text-gray-500 ml-2">{commentTimestamp}</Text>
                    </View>
                    <Text className="text-sm ml-8">{lastComment.comment}</Text>
                </View>
            )}

            {/* Buttons Row */}
            <View className="flex-row mt-2">
                <TouchableOpacity
                    style={{ backgroundColor: "#046289" }}
                    className="flex-1 py-2 mr-1 rounded-lg flex-row justify-center items-center"
                    onPress={handleCallPress}
                >
                    <Ionicons name="call" size={16} color="#fff" className="mr-1" />
                    <Text className="text-white text-sm">Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ backgroundColor: "#046289" }}
                    className="flex-1 py-2 ml-1 rounded-lg flex-row justify-center items-center"
                >
                    <Ionicons name="chatbubble" size={16} color="#fff" className="mr-1" />
                    <Text className="text-white text-sm">Message</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ReminderCard;

// -- Dummy Data and TestScreen --

const dummyReminder: Reminder = {
    status: 'Pending',
    name: 'John Doe',
    phone: ['+123456789', '+987654321'],
    address: {
        address: '123 Main St',
        area: 'Downtown',
        district: 'Central',
        division: 'Metro',
    },
    creName: {
        nameAsPerNID: 'Jane Smith',
        profilePicture: 'https://via.placeholder.com/28',
    },
};

const dummyLatestReminder: LatestReminder = {
    status: 'Late',
};

const dummyLastComment: LastComment = {
    commentBy: {
        nameAsPerNID: 'Alice',
        profilePicture: 'https://via.placeholder.com/24',
    },
    comment: 'Please follow up with the client by tomorrow.',
};

const formattedDate = '09/15/2025';
const formattedTime = '10:30 AM';
const commentTimestamp = '5 mins ago';

const getStatusColor = (status: string): string => {
    // Return a color based on the status.
    if (status === 'Late') return '#f44336';
    if (status === 'Pending') return '#ff9800';
    return '#2196f3';
};

export const TestScreen: React.FC = () => {
    return (
        <ScrollView className="bg-gray-100 p-4">
            <Text className="text-2xl font-bold text-center mb-4">Reminder Cards</Text>
            <ReminderCard
                reminder={dummyReminder}
                latestReminder={dummyLatestReminder}
                lastComment={dummyLastComment}
                formattedDate={formattedDate}
                formattedTime={formattedTime}
                commentTimestamp={commentTimestamp}
                getStatusColor={getStatusColor}
            />
            {/* Render another ReminderCard component to demonstrate multiple cards */}
            <ReminderCard
                reminder={dummyReminder}
                latestReminder={dummyLatestReminder}
                lastComment={dummyLastComment}
                formattedDate={formattedDate}
                formattedTime={formattedTime}
                commentTimestamp={commentTimestamp}
                getStatusColor={getStatusColor}
            />
        </ScrollView>
    );
};
