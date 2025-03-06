import { useGetDepartmentByIdQuery } from '@/features/slices/auth/AuthAPI';
import { RootState } from '@/features/strore';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

const ConversationFilter = ({ setFilters, filters, availableFilters }) => {
	const [isDropdownVisible, setDropdownVisible] = useState(false);
	const [selectedFilters, setSelectedFilters] = useState({
		statuses: [],
		creNames: [],
		pages: [],
	});

	const { user } = useSelector((state: RootState) => state.auth);
	const { data: department } = useGetDepartmentByIdQuery(user?.departmentId, {
		skip: !user?.departmentId,
	});

	// find CRE role id in department
	const creRoleId = department?.roles.find(
		role => role.roleName === 'CRE'
	)?._id;

	useEffect(() => {
		// if user is a cre then add user to cre Filter
		if (user?.roleId === creRoleId) {
			setFilters(prevFilters => {
				if (!prevFilters.creNames.includes(user?._id)) {
					return {
						...prevFilters,
						creNames: [user?._id],
					} as typeof prevFilters;
				}
				return prevFilters as typeof prevFilters;
			});
		}
	}, [user?.roleId, creRoleId, user?._id, filters]);

	// Filters coming from availableFilters prop
	const { statuses = [], creNames = [], pages = [] } = availableFilters || {};

	const toggleDropdown = () => {
		setDropdownVisible(!isDropdownVisible);
	};

	const handleFilterSelect = (category, item) => {
		setSelectedFilters(prevFilters => {
			const isSelected = prevFilters[category].includes(item);

			// Toggle the selection of the item
			const updatedItems = isSelected
				? prevFilters[category].filter(i => i !== item)
				: [...prevFilters[category], item];

			return {
				...prevFilters,
				[category]: updatedItems,
			};
		});
	};

	const applyFilters = () => {
		setFilters(prev => ({
			...prev,
			statuses: selectedFilters.statuses,
			creNames: selectedFilters.creNames,
			pages: selectedFilters.pages,
		}));
		setDropdownVisible(false);
	};

	return (
		<View className="p-4 border-b border-gray-200 ">
			{/* Buttons for All and Unseen */}
			<View className="flex-row items-center justify-between mb-4">
				<View className="flex-row gap-4">
					<TouchableOpacity
						className={`px-4 py-2 rounded-lg ${
							filters?.messagesSeen === null ? 'bg-primary' : 'bg-gray-200'
						}`}
						onPress={() =>
							setFilters({
								...filters,
								messagesSeen: null, // Reset filters
							})
						}
					>
						<Text
							className={`text-sm font-semibold ${
								filters?.messagesSeen === null ? 'text-white' : 'text-gray-700'
							}`}
						>
							All
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						className={`px-4 py-2 rounded-lg ${
							filters?.messagesSeen === false ? 'bg-primary' : 'bg-gray-200'
						}`}
						onPress={() =>
							setFilters({
								...filters,
								messagesSeen: false, // Filter unseen
							})
						}
					>
						<Text
							className={`text-sm font-semibold ${
								filters?.messagesSeen === false ? 'text-white' : 'text-gray-700'
							}`}
						>
							Unseen
						</Text>
					</TouchableOpacity>
				</View>

				{/* Filter Dropdown Toggle */}
				<TouchableOpacity
					className="p-2 rounded-lg bg-gray-200"
					onPress={toggleDropdown}
				>
					<Icon name="filter" size={14} color="gray" />
				</TouchableOpacity>
			</View>

			{/* Filter Dropdown Menu */}
			{isDropdownVisible && (
				<View className="p-4 bg-white rounded-lg shadow">
					{/* Status Filters */}
					<View className="mb-4">
						<Text className="font-bold text-gray-700 mb-2">Status</Text>
						<FlatList
							data={statuses}
							keyExtractor={item => item}
							renderItem={({ item }) => (
								<TouchableOpacity
									className="flex-row items-center gap-2 mb-2"
									onPress={() => handleFilterSelect('statuses', item)}
								>
									<Icon
										name={
											selectedFilters.statuses.includes(item)
												? 'checkbox-marked'
												: 'checkbox-blank-outline'
										}
										size={20}
										color="gray"
									/>
									<Text>{item}</Text>
								</TouchableOpacity>
							)}
						/>
					</View>

					{/* CRE Filters */}
					{user?.type === 'Admin' && (
						<View className="mb-4">
							<Text className="font-bold text-gray-700 mb-2">CRE</Text>
							<FlatList
								data={creNames}
								keyExtractor={item => item._id}
								renderItem={({ item }) => (
									<TouchableOpacity
										className="flex-row items-center gap-2 mb-2"
										onPress={() => handleFilterSelect('creNames', item._id)}
									>
										<Icon
											name={
												selectedFilters?.creNames.includes(item._id)
													? 'checkbox-marked'
													: 'checkbox-blank-outline'
											}
											size={20}
											color="gray"
										/>
										<Image
											source={{ uri: item.profilePicture }}
											className="w-6 h-6 rounded-full"
										/>
										<Text>{item.nickname}</Text>
									</TouchableOpacity>
								)}
							/>
						</View>
					)}

					{/* Pages Filters */}
					<View className="mb-4">
						<Text className="font-bold text-gray-700 mb-2">Pages</Text>
						<FlatList
							data={pages}
							keyExtractor={item => item.pageId}
							renderItem={({ item }) => (
								<TouchableOpacity
									className="flex-row items-center gap-2 mb-2"
									onPress={() => handleFilterSelect('pages', item.pageId)}
								>
									<Icon
										name={
											selectedFilters.pages.includes(item.pageId)
												? 'checkbox-marked'
												: 'checkbox-blank-outline'
										}
										size={20}
										color="gray"
									/>
									<Image
										source={{ uri: item.pageProfilePicture }}
										className="w-6 h-6 rounded-full"
									/>
									<Text>{item.pageName}</Text>
								</TouchableOpacity>
							)}
						/>
					</View>

					{/* Apply Filters Button */}
					<TouchableOpacity
						className="w-full bg-primary p-3 rounded-lg"
						onPress={applyFilters}
					>
						<Text className="text-center text-white font-bold">
							Apply Filters
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};

export default ConversationFilter;
