import React, { useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import { Avatar, Menu } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import useDebounce from '@/hooks/useDebounce';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchText } from '@/features/slices/searchSlice';
import { RootState } from '@/features/store';

const TopHeader = ({ userData, handleLogout }) => {
	const [menuVisible, setMenuVisible] = React.useState(false);
	const dispatch = useDispatch();
	const searchText = useSelector((state: RootState) => state.search.searchText);
	const debouncedSearchText = useDebounce(searchText, 500);
	const router = useRouter();

	useEffect(() => {
		// Trigger side effects with the debounced search value if needed.
		console.log('Debounced Search:', debouncedSearchText);
	}, [debouncedSearchText]);

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

			{/* Search Input Area */}
			<View className="flex-1 mx-3">
				<View className="flex-row items-center border border-primary h-10 px-4 rounded-full bg-gray-100">
					<Icon name="magnify" size={22} color="gray" />
					<TextInput
						placeholder="Find Solutions"
						value={searchText}
						onChangeText={(text) => dispatch(setSearchText(text))}
						className="ml-2 flex-1 text-sm font-bold text-gray-600"
					/>
				</View>
			</View>

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
						<Avatar.Image size={35} source={{ uri: userData?.profilePicture }} />
					</TouchableOpacity>
				}
				contentStyle={{ backgroundColor: 'white', borderRadius: 8, elevation: 5 }}
			>
				<Menu.Item
					onPress={() => {
						closeMenu();
						router.push('/profile');
					}}
					title="Profile"
					titleStyle={{ color: '#000' }}
					leadingIcon={() => (
						<Icon name="account-circle-outline" size={20} color="black" />
					)}
				/>
				<Menu.Item
					onPress={() => {
						closeMenu();
						handleLogout();
					}}
					title="Logout"
					titleStyle={{ color: '#000' }}
					leadingIcon={() => <Icon name="logout" size={20} color="red" />}
				/>
			</Menu>
		</View>
	);
};

export default TopHeader;
