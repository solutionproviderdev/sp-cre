import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Avatar, Menu } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

const TopHeader = ({ userData, handleLogout }) => {
	const [menuVisible, setMenuVisible] = useState(false);
	const router = useRouter();

	const openMenu = () => setMenuVisible(true);
	const closeMenu = () => setMenuVisible(false);

	return (
		<View className="flex-row items-center justify-between px-4 py-2 bg-gray-100">
			{/* Gear Icon */}
			<TouchableOpacity>
				<Image
					source={require('@/assets/sp_gear_icon.png')}
					className="w-8 h-8 rounded-full"
				/>
			</TouchableOpacity>

			{/* Search Bar */}
			<TouchableOpacity
				className="flex-1 mx-3 flex-row items-center justify-center border border-primary h-10 px-4 rounded-full bg-gray-100"
				onPress={() => router.push('/meeting/SearchMeeting')}
			>
				<Icon name="magnify" size={22} color="gray" />
				<View className="ml-2 flex-row">
					<Text className="text-sm font-bold text-gray-600">Find </Text>
					<Text className="text-sm font-bold text-primary">Solutions</Text>
				</View>
			</TouchableOpacity>

			{/* Notification Icon */}
			<TouchableOpacity className="mr-3">
				<Icon name="bell-badge-outline" size={25} color="rgb(4, 98, 138)" />
			</TouchableOpacity>

			{/* Dropdown Menu */}
			<Menu
				visible={menuVisible}
				onDismiss={closeMenu}
				anchor={
					<TouchableOpacity onPress={openMenu}>
						<Avatar.Image
							size={35}
							source={{
								uri:
									userData?.profilePicture,
							}}
						/>
					</TouchableOpacity>
				}
				contentStyle={{
					backgroundColor: 'white',
					borderRadius: 8,
					elevation: 5,
				}}
			>
				{/* Profile Option */}
				<Menu.Item
					onPress={() => {
						closeMenu();
						router.push('/profile');
					}}
					title="Profile"
					titleStyle={{ color: '#000000' }}
					leadingIcon={() => (
						<Icon name="account-circle-outline" size={20} color="black" />
					)}
				/>
				{/* Logout Option */}
				<Menu.Item
					onPress={() => {
						closeMenu();
						handleLogout();
					}}
					title="Logout"
					titleStyle={{ color: '#000000' }}
					leadingIcon={() => <Icon name="logout" size={20} color="red" />}
				/>
			</Menu>
		</View>
	);
};

export default TopHeader;
