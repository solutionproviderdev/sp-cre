import React, { useState } from 'react';
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Image,
	ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/features/strore';
import {
	useGetAllConversationsQuery,
	// useMarkAsSeenMutation,
} from '@/features/slices/auth/AuthAPI';
import ConversationItem from '@/components/chat/ConversationItem';
import ConversationFilter from '@/components/chat/ConversationFilter';

const HomeScreen = () => {
	const page = 1;
	const limit = 500;
	const { data, error, isLoading, refetch } = useGetAllConversationsQuery({
		page,
		limit,
	});

	// const [markAsSeen] = useMarkAsSeenMutation();

	// Filters state
	const [filters, setFilters] = useState({
		statuses: [],
		creNames: [],
		pages: [],
		messagesSeen: null,
	});

	// Filter conversations
	const applyFilters = conversations => {
		if (!conversations) return [];

		let filtered = [...conversations];

		// Apply filters for statuses
		if (filters?.statuses.length > 0) {
			filtered = filtered.filter(conversation =>
				filters.statuses.includes(conversation.status)
			);
		}

		// Apply filters for creNames
		if (filters?.creNames.length > 0) {
			filtered = filtered.filter(conversation =>
				filters.creNames.includes(conversation.creName?._id)
			);
		}

		// Apply messagesSeen filter ONLY if it's true or false (ignore null)
		if (filters?.messagesSeen !== null) {
			filtered = filtered.filter(
				conversation => conversation?.messagesSeen === filters?.messagesSeen
			);
		}

		// Apply filters for pages
		if (filters?.pages.length > 0) {
			filtered = filtered.filter(conversation =>
				filters.pages.includes(conversation?.pageInfo?.pageId)
			);
		}

		return filtered;
	};

	const filteredConversations = applyFilters(data?.leads);

	// Handle selecting a conversation
	const handleSelectConversation = async selectedLeadId => {
		// await markAsSeen({ id: selectedLeadId });
		// Navigate to conversation details (Placeholder for now)
		console.log('Navigate to conversation with ID:', selectedLeadId);
	};

	// Render individual conversation item
	const renderConversationItem = ({ item }) => {
		return <ConversationItem item={item} />;
	};

	// Loader or Error State
	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" color="#046289" />
			</View>
		);
	}

	if (error) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text className="text-red-500">
					Error fetching conversations: {error.message}
				</Text>
			</View>
		);
	}

	// No Data State
	if (!filteredConversations || filteredConversations.length === 0) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text className="text-gray-500">
					No conversations found for the selected filters.
				</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-white">
			{/* Filter  */}
			<ConversationFilter
				availableFilters={data?.filters}
				setFilters={setFilters}
				filters={filters}
			/>
			{/* Conversations List */}
			<FlatList
				refreshing={isLoading}
				onRefresh={refetch}
				data={filteredConversations}
				keyExtractor={item => item._id}
				renderItem={renderConversationItem}
				contentContainerStyle={{ paddingBottom: 16 }}
			/>
		</View>
	);
};

export default HomeScreen;
