import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Conversation } from '@/types/Conversation';
import moment from 'moment';
import { FontAwesome } from '@expo/vector-icons';
import { useMarkAsSeenMutation } from '@/features/slices/auth/AuthAPI';
import { router } from 'expo-router';

interface ConversationItemProps {
	item: Conversation;
}

const ConversationItem = ({ item }: ConversationItemProps) => {
	const isMessageSeen = item.messagesSeen;
	const [markAsSeen] = useMarkAsSeenMutation();

	// Calculate time left similar to the web version
	const lastCustomerMessageTime = item.lastCustomerMessageTime;
	let timeLeftText = '';
	if (lastCustomerMessageTime) {
		const now = moment();
		const lastMsgTime = moment(lastCustomerMessageTime);
		const elapsed = now.diff(lastMsgTime);
		const total24h = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
		const timeLeftMs = total24h - elapsed;
		timeLeftText =
			timeLeftMs > 0 ? moment.utc(timeLeftMs).format('HH:mm') : 'Expired';
	}

	const handleSelectConversation = async (selectedLeadId: string) => {
		// Navigate to conversation details (Placeholder for now)
		router.push(`/conversations/${selectedLeadId}`);
		await markAsSeen({ id: selectedLeadId });
	};

	return (
		<TouchableOpacity
			className="flex-row items-center p-4 border-b border-gray-200"
			onPress={() => handleSelectConversation(item._id)}
		>
			{/* Page Profile Picture */}
			<View
				className={`w-14 h-14 rounded-full overflow-hidden ${
					isMessageSeen ? '' : 'border-2 border-primary'
				}`}
			>
				<Image
					source={{ uri: item.pageInfo?.pageProfilePicture }}
					className="w-full h-full"
				/>
			</View>

			{/* Main Info */}
			<View className="ml-4 flex-1">
				{/* Name, Time Left, and Status */}
				<View className="flex-row items-center justify-between">
					<Text
						className={`text-base ${
							isMessageSeen ? 'text-gray-500' : 'text-primary font-bold'
						}`}
					>
						{item.name}
					</Text>
					<View className="flex-row items-center gap-2">
						{lastCustomerMessageTime && (
							<View className="flex-row items-center">
								{timeLeftText !== 'Expired' && (
									<FontAwesome
										name="clock-o"
										size={12}
										color={timeLeftText === 'Expired' ? '#941F1F' : '#046289'}
									/>
								)}
								<Text
									style={{
										color: timeLeftText === 'Expired' ? '#941F1F' : '#046289',
									}}
									className={`text-xs ${
										timeLeftText === 'Expired' ? 'font-bold' : ''
									} ml-1`}
								>
									{timeLeftText}
								</Text>
							</View>
						)}
						<Text className="text-xs text-white bg-primary px-2 py-1 rounded-lg">
							{item.status}
						</Text>
						{item.creName && (
							<Image
								source={{ uri: item.creName.profilePicture }}
								className="w-6 h-6 rounded-full border-2 border-primary"
							/>
						)}
					</View>
				</View>

				{/* Last Message and Time */}
				<View className="flex-row items-center justify-between">
					<Text
						className={`text-sm max-w-xs ${
							isMessageSeen ? 'text-gray-500' : 'text-primary font-bold'
						}`}
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{item.lastMessage}
					</Text>
					<Text className="text-xs text-gray-500">
						{moment(item.lastMessageTime).fromNow()}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default ConversationItem;

const styles = StyleSheet.create({});
