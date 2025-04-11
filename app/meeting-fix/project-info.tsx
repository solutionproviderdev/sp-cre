import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, Platform, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetSingleLeadQuery } from '@/features/slices/conversation/ConversationAPI';
import { MeetingContext } from './MeetingContext';
import { useFixMeetingMutation } from '@/features/meetings/meetinApi';
import { KeyboardAvoidingView } from 'react-native';



interface ProjectInfoProps {
    defaultData: {
        name: string;
        phone: string[];
        projectLocation: string;
        projectStatus: {
            status: string;
            subStatus: string;
        };
        requirements: string[];
        visitCharge: number;
        comment: string;
        source?: string;
        cre?: string;
    };
    onChange: (updatedData: {
        name?: string;
        phone?: string[];
        projectLocation?: string;
        projectStatus?: {
            status?: string;
            subStatus?: string;
        };
        requirements?: string[];
        visitCharge?: number;
        comment?: string;
        source?: string;
        cre?: string;
    }) => void;
    sourceField?: boolean;
    creField?: boolean;
    selectedLeadId: string;
}

export default function ProjectInfoStep({
    defaultData,
    onChange = () => { },
    sourceField,
    creField,
    selectedLeadId,
}: ProjectInfoProps) {
    // Retrieve leadId from query parameters.
    const { leadId } = useLocalSearchParams();
    // console.log('my lead id', leadId);
    const { data: lead, isFetching } = useGetSingleLeadQuery(leadId as string);

    // Update defaultData once API data is available.
    defaultData = {
        name: lead?.name || '',
        phone: lead?.phone || [],
        projectLocation: lead?.projectLocation || 'Inside',
        projectStatus: lead?.projectStatus || { status: '', subStatus: '' },
        requirements: lead?.requirements || [],
        visitCharge: 0,
        comment: '',
        source: lead?.source || '',
        cre: lead?.creName || '',
    };

    const [formData, setFormData] = useState(defaultData);
    const [newRequirement, setNewRequirement] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [showRequirementInput, setShowRequirementInput] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [tempComment, setTempComment] = useState(formData.comment);

    const router = useRouter();

    // Access meeting context (data from previous screens)
    const { meetingData, setMeetingData } = useContext(MeetingContext);

    // Prepare your fixMeeting mutation hook.
    const [fixMeeting] = useFixMeetingMutation();

    const statusOptions = ['Ongoing', 'Ready', 'Renovation'];
    const subStatusOptions: { [key: string]: string[] } = {
        Ongoing: ['Roof Casting', 'Brick Wall', 'Plaster', 'Pudding', 'Two Coat Paint'],
        Ready: ['Tiles Complete', 'Final Paint Done', 'Handed Over', 'Staying in the Apartment'],
        Renovation: ['Interior Work Complete'],
    };

    const quickSelectVisitCharge = (amount: number) => {
        handleInputChange('visitCharge', amount);
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prevData => {
            const updatedData = { ...prevData, [field]: value };
            onChange(updatedData);
            return updatedData;
        });
    };

    const handleStatusChange = (status: string) => {
        handleInputChange('projectStatus', { status, subStatus: '' });
    };

    // Add new requirement chip
    const addRequirement = () => {
        if (newRequirement.trim() !== '') {
            const updatedRequirements = [...formData.requirements, newRequirement];
            handleInputChange('requirements', updatedRequirements);
            setNewRequirement('');
            setShowRequirementInput(false);
        }
    };

    // Delete requirement chip
    const handleDeleteRequirement = (index: number) => {
        const updatedRequirements = formData.requirements.filter((_, idx) => idx !== index);
        handleInputChange('requirements', updatedRequirements);
    };

    // Add a new phone number
    const handleAddPhone = () => {
        if (newPhone.trim() !== '') {
            const updatedPhones = [...formData.phone, newPhone];
            handleInputChange('phone', updatedPhones);
            setNewPhone('');
        }
    };

    // Save the comment from modal and close modal
    const saveComment = () => {
        handleInputChange('comment', tempComment);
        setShowCommentModal(false);
    };

    // Cancel button handler – navigate back.
    const handleCancel = () => {
        router.back();
    };

    const handleSubmit = async () => {
        // Update the MeetingContext with the latest project info.
        setMeetingData(prev => ({
            ...prev,
            projectInfo: formData,
        }));

        // Construct the payload by merging data from MeetingContext and local form.
        const newMeetingPayload = {
            leadId: Array.isArray(leadId) ? leadId[0] : leadId, // Ensure leadId is a string , it can be a string[] too.
            date: meetingData.date, // collected from previous screens
            slot: meetingData.slot,
            salesExecutive: meetingData.salesExecutive,
            status: "Fixed" as "Fixed", // explicitly cast to the correct literal type
            visitCharge: formData.visitCharge,
            name: formData.name,
            address: meetingData.address, // address collected earlier
            phone: formData.phone,
            projectLocation: formData.projectLocation,
            requirements: formData.requirements,
            projectStatus: formData.projectStatus,
            comment: { text: formData.comment, images: [] }, // comment as an object
        };

        // console.log({ newMeetingPayload });

        try {
            const res = await fixMeeting(newMeetingPayload).unwrap();
            // On success, navigate to the conversation/inbox screen.
            router.replace('/(tabs)');
            // router.push(`/conversations/${leadId}`);
        } catch (error) {
            console.error('Error fixing meeting:', error);
            Alert.alert('Error', 'There was an error updating the meeting. Please try again.');
        }
    };


    if (isFetching) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (

        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 bg-white justify-center p-5">
                    {/* Form Container */}
                    <View className="gap-5">
                        {/* CRE Field */}
                        {creField && (
                            <View>
                                <Text className="mb-2 font-bold text-[#046289]">CRE</Text>
                                <TextInput
                                    placeholder="Select CRE"
                                    value={formData.cre}
                                    onChangeText={(text) => handleInputChange('cre', text)}
                                    className="border border-gray-200 p-2 rounded"
                                />
                            </View>
                        )}

                        {/* Name Field */}
                        <View>
                            <Text className="font-bold text-[#046289]">Name</Text>
                            <TextInput
                                value={formData.name}
                                onChangeText={(text) => handleInputChange('name', text)}
                                className="border border-gray-200 p-2 rounded text-gray-500"
                            />
                        </View>

                        {/* Phone Numbers Section */}
                        <View>
                            <Text className="font-bold text-[#046289]">Phone Numbers</Text>
                            {formData.phone && formData.phone.length > 0 ? (
                                formData.phone.map((phone, index) => (
                                    <View key={index} className="mb-2">
                                        <TextInput
                                            value={phone}
                                            className="border border-gray-200 p-2 rounded text-gray-500"
                                            editable={false}
                                        />
                                    </View>
                                ))
                            ) : (
                                <View className="flex-row items-center space-x-2">
                                    <TextInput
                                        placeholder="Add Phone Number"
                                        value={newPhone}
                                        onChangeText={setNewPhone}
                                        className="border border-gray-200 p-2 rounded flex-1 text-gray-500 mr-2"
                                    />
                                    <TouchableOpacity onPress={handleAddPhone} className="border border-[#046289] p-2 rounded">
                                        <Text className="text-[#046289]">Add</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        {/* Source Field */}
                        {sourceField && (
                            <View>
                                <Text className="font-bold text-[#046289]">Source</Text>
                                <Picker
                                    selectedValue={formData.source}
                                    onValueChange={(value) => handleInputChange('source', value)}
                                    className="border border-gray-200"
                                >
                                    <Picker.Item label="Phone" value="Phone" />
                                    <Picker.Item label="WhatsApp" value="WhatsApp" />
                                </Picker>
                            </View>
                        )}

                        {/* Project Location Section */}
                        <View>
                            <Text className="font-bold text-[#046289]">Project Location</Text>
                            <View className="border border-gray-200">
                                <Picker
                                    selectedValue={formData.projectLocation}
                                    onValueChange={(value) => handleInputChange('projectLocation', value)}
                                    className="border border-gray-200"
                                >
                                    <Picker.Item label="Inside" value="Inside" />
                                    <Picker.Item label="Outside" value="Outside" />
                                </Picker>
                            </View>
                        </View>

                        {/* Project Status & Sub Status */}
                        <View className="flex-row gap-2">
                            <View className="flex-1">
                                <Text className="font-bold text-[#046289]">Project Status</Text>
                                <View className="border border-gray-200">
                                    <Picker
                                        selectedValue={formData.projectStatus.status}
                                        onValueChange={(value) => handleStatusChange(value)}
                                        className="border border-gray-200"
                                    >
                                        {statusOptions.map((status) => (
                                            <Picker.Item key={status} label={status} value={status} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                            <View className="flex-1">
                                <Text className="font-bold text-[#046289]">Sub Status</Text>
                                <View className="border border-gray-200">
                                    <Picker
                                        selectedValue={formData.projectStatus.subStatus}
                                        onValueChange={(value) =>
                                            handleInputChange('projectStatus', {
                                                ...formData.projectStatus,
                                                subStatus: value,
                                            })
                                        }
                                        enabled={!!formData.projectStatus.status}
                                    >
                                        {subStatusOptions[formData.projectStatus.status]?.map((sub) => (
                                            <Picker.Item key={sub} label={sub} value={sub} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        </View>

                        {/* Requirements Section */}
                        <View>
                            <Text className="font-bold text-[#046289]">Requirements</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {formData.requirements.map((req, idx) => (
                                    <View key={idx} className="flex-row items-center bg-gray-200 px-2 py-1 rounded-full">
                                        <Text className="text-xs text-gray-500">{req}</Text>
                                        <TouchableOpacity onPress={() => handleDeleteRequirement(idx)} className="ml-1">
                                            <Text className="text-xs text-red-500">×</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                            <View className="flex-row items-start gap-2 mt-2">
                                <TextInput
                                    placeholder="Add Requirement"
                                    value={newRequirement}
                                    onChangeText={setNewRequirement}
                                    className="w-2/4 border border-gray-200 p-2 rounded text-gray-500"
                                />
                                <TouchableOpacity onPress={addRequirement} className="border border-[#046289] p-2 rounded">
                                    <Text className="text-[#046289]">Add</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Visit Charge Section */}
                        <View>
                            <Text className="font-bold text-[#046289]">Visit Charge (BDT)</Text>
                            <TextInput
                                value={formData.visitCharge.toString()}
                                onChangeText={(text) => handleInputChange('visitCharge', parseFloat(text))}
                                keyboardType="numeric"
                                className="border border-gray-200 p-2 rounded mb-2 text-gray-500"
                            />
                            <View className="flex-row items-center">
                                {[0, 500, 800, 1000, 1500, 3000, 5000].map((amount) => (
                                    <TouchableOpacity
                                        key={amount}
                                        onPress={() => quickSelectVisitCharge(amount)}
                                        className={`ml-1 py-1 px-2 rounded-full ${formData.visitCharge === amount ? 'bg-[#046289]' : 'border border-[#046289]'
                                            }`}
                                    >
                                        <Text className={formData.visitCharge === amount ? 'text-white' : 'text-[#046289]'}>
                                            {amount === 0 ? 'Free' : amount}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Comment Section Trigger */}
                        <View>
                            <Text className="font-bold text-[#046289]">Comment</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setTempComment(formData.comment);
                                    setShowCommentModal(true);
                                }}
                                className="border border-gray-200 p-2 rounded"
                            >
                                <Text className="text-gray-500">{formData.comment ? formData.comment : 'Add Comment'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Two buttons side by side for Cancel and Submit */}
                    <View className="mt-6 flex-row justify-between">
                        <TouchableOpacity onPress={handleCancel} className="bg-gray-400 py-3 px-6 rounded-lg flex-1 mr-2">
                            <Text className="text-white font-bold text-center">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmit} className="bg-[#046289] py-3 px-6 rounded-lg flex-1 ml-2">
                            <Text className="text-white font-bold text-center">Submit</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Comment Modal */}
                    <Modal visible={showCommentModal} transparent animationType="slide">
                        <View className="flex-1 bg-black/50 justify-center items-center p-4">
                            <View className="bg-white rounded-lg p-6 w-full max-w-md">
                                <Text className="text-lg font-bold mb-4">Enter Comment</Text>
                                <TextInput
                                    multiline
                                    numberOfLines={4}
                                    value={tempComment}
                                    onChangeText={setTempComment}
                                    className="border border-gray-200 p-2 rounded mb-4 text-gray-500"
                                />
                                <View className="flex-row justify-end space-x-4">
                                    <TouchableOpacity onPress={() => setShowCommentModal(false)} className="bg-gray-400 py-2 px-4 rounded-lg">
                                        <Text className="text-white font-bold">Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={saveComment} className="bg-blue-600 py-2 px-4 rounded-lg">
                                        <Text className="text-white font-bold">Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
