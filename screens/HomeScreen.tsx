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
import { useSearchLeadsQuery } from '@/features/lead/leadApi';
import SearchResultList from '@/components/chat/SearchResultList';

const HomeScreen = () => {

	const searchText = useSelector((state: RootState) => state.search.searchText);
	const { user } = useSelector(state => state.auth);


	const page = 1;
	const limit = 500;
	// Query for all conversations (default)
	const {
		data: conversationsData,
		error: convError,
		isLoading: convIsLoading,
		refetch: refetchConversations
	} = useGetAllConversationsQuery({ page, limit }, { refetchOnMountOrArgChange: true });




	// const [markAsSeen] = useMarkAsSeenMutation();

	// Filters state
	const [filters, setFilters] = useState({
		statuses: [],
		creNames: [],
		pages: [],
		messagesSeen: null,
	});




	// console.log('checking cre name:', user._id, searchText);
	const {
		data: searchData,
		error: searchError,
		isLoading: searchIsLoading,
		refetch: refetchSearch,
	} = useSearchLeadsQuery(
		{
			searchTerm: searchText,
			creName: user._id,
		},
		{ skip: !searchText }
	);






	// console.log("searchData leads length:", searchData);
	// console.log("leadsData leads length:", leadsData?.leads?.length);

	// Filter conversations using additional filters (statuses, creNames, etc.)

	
	const applyFilters = (conversations) => {
		if (!conversations) return [];
		let filtered = [...conversations];

		// Filter by statuses
		if (filters.statuses.length > 0) {
			filtered = filtered.filter(convo =>
				filters.statuses.includes(convo.status)
			);
		}

		// Filter by creNames
		if (filters.creNames.length > 0) {
			filtered = filtered.filter(convo =>
				filters.creNames.includes(convo.creName?._id)
			);
		}

		// Filter by messagesSeen (only if not null)
		if (filters.messagesSeen !== null) {
			filtered = filtered.filter(
				convo => convo.messagesSeen === filters.messagesSeen
			);
		}

		// Filter by pages
		if (filters.pages.length > 0) {
			filtered = filtered.filter(convo =>
				filters.pages.includes(convo?.pageInfo?.pageId)
			);
		}

		return filtered;
	};

	const filteredConversations = applyFilters(conversationsData?.leads);

	// Handle selecting a conversation
	// const handleSelectConversation = async selectedLeadId => {
	// 	// await markAsSeen({ id: selectedLeadId });
	// 	// Navigate to conversation details (Placeholder for now)
	// 	console.log('Navigate to conversation with ID:', selectedLeadId);
	// };

	// Render individual conversation item
	const renderConversationItem = ({ item }) => {
		return <ConversationItem item={item} />;
	};


	// Loading state: if a search is active or the default query is loading
	if ((searchText && searchIsLoading) || convIsLoading) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" color="#046289" />
			</View>
		);
	}

	// Error state: if search query errors out
	if (searchText && searchError) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text className="text-red-500">
					Error fetching search results: {searchError.message}
				</Text>
			</View>
		);
	}

	// No data state
	if (!searchText && (!filteredConversations || filteredConversations.length === 0)) {
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
			{/* Pass available filters from the current data source */}
			<ConversationFilter
				availableFilters={conversationsData?.filters}
				setFilters={setFilters}
				filters={filters}
			/>
			{/* Conversations List */}
			{searchText ? (
				// If there is a search term, render the mobile SearchResultList
				<SearchResultList
					searchResult={searchData}
					isLoading={searchIsLoading}
				/>
			) : (
				// Otherwise, render the normal conversation list
				<FlatList
					refreshing={ convIsLoading}
					onRefresh={ refetchConversations}
					data={filteredConversations}
					keyExtractor={(item) => item._id}
					renderItem={({ item }) => <ConversationItem item={item} />}
					contentContainerStyle={{ paddingBottom: 16 }}
				/>
			)}
		</View>
	);
};

export default HomeScreen;
