import React from 'react';
import {
	Alert,
	TouchableOpacity,
	View,
	Text,
	useColorScheme,
} from 'react-native';
import { CurvedBottomBarExpo } from 'react-native-curved-bottom-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
// import HomeScreen from '@/screens/HomeScreen';
import HomeScreen from '@/screens/HomeScreen';
import MeetingsScreen from '@/screens/meetings';
import FollowUpScreen from '@/screens/FollowUpScreen';
import CallLogsScreen from '@/screens/calls';
import { StatusBar } from 'expo-status-bar';
import { darkTheme, lightTheme } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopHeader from '@/components/TopHeader';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/features/strore';
import { logoutUser } from '@/features/slices/auth/AuthSlice';
import { router } from 'expo-router';

export default function App() {
	const colorScheme = useColorScheme(); // Get the system's color scheme (light or dark)
	const paperTheme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const { user } = useSelector((state: RootState) => state.auth);
	const dispatch = useDispatch();

	const renderIcon = (routeName, selectedTab) => {
		let iconName = '';

		switch (routeName) {
			case 'home':
				iconName = 'home-outline';
				break;
			case 'meetings':
				iconName = 'people-outline';
				break;
			case 'follow-up':
				iconName = 'telescope-outline';
				break;
			case 'calls':
				iconName = 'call-outline';
				break;
			default:
				iconName = 'circle-outline';
		}

		return (
			<Ionicons
				name={iconName}
				size={24}
				color={routeName === selectedTab ? '#046289' : '#9BA1A6'}
			/>
		);
	};

	const renderTabBar = ({ routeName, selectedTab, navigate }) => (
		<TouchableOpacity
			onPress={() => navigate(routeName)}
			className="flex-1 items-center justify-center"
		>
			<View className="items-center">
				{renderIcon(routeName, selectedTab)}
				<Text
					className={`text-xs font-semibold ${
						routeName === selectedTab ? 'text-primary' : 'text-gray-500'
					}`}
				>
					{routeName === 'home'
						? 'Home'
						: routeName === 'meetings'
						? 'Meetings'
						: routeName === 'follow-up'
						? 'Follow-Up'
						: 'Calls'}
				</Text>
			</View>
		</TouchableOpacity>
	);

	// handle log out function
	const handleLogout = () => {
		// Logout Logic
		dispatch(logoutUser());

		router.replace('/auth/Login');

	}

	return (
		<SafeAreaView  className="flex-1">
			<TopHeader userData={user} handleLogout={handleLogout} />
			<CurvedBottomBarExpo.Navigator
				type="DOWN"
				screenOptions={{
					headerShown: false,
				}}
				style={{ backgroundColor: '#D9D9D9' }}
				height={65}
				circleWidth={60}
				circlePosition="center"
				bgColor="#D9D9D9"
				initialRouteName="home"
				borderTopLeftRight
				renderCircle={({ selectedTab, navigate }) => (
					<View className="bg-primary w-14 h-14 rounded-full items-center justify-center -mt-6 shadow-lg">
						<TouchableOpacity onPress={() => Alert.alert('Add Button Pressed')}>
							<Ionicons name="add-outline" size={28} color="#FFF" />
						</TouchableOpacity>
					</View>
				)}
				tabBar={renderTabBar}
			>
				<CurvedBottomBarExpo.Screen
					name="home"
					position="LEFT"
					component={HomeScreen}
					headerShown={true}
				/>
				<CurvedBottomBarExpo.Screen
					name="meetings"
					position="LEFT"
					component={MeetingsScreen}
				/>
				<CurvedBottomBarExpo.Screen
					name="follow-up"
					position="RIGHT"
					component={FollowUpScreen}
				/>
				<CurvedBottomBarExpo.Screen
					name="calls"
					position="RIGHT"
					component={CallLogsScreen}
				/>
			</CurvedBottomBarExpo.Navigator>
			{/* <StatusBar
				style={colorScheme === 'dark' ? 'light' : 'dark'}
				backgroundColor={
					colorScheme === 'dark'
						? paperTheme.colors.background
						: paperTheme.colors.background
				}
			/> */}
		</SafeAreaView>
	);
}
