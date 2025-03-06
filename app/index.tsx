import React, { useEffect } from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	SafeAreaView,
	Dimensions,
	AppState,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useSelector } from 'react-redux';
import { RootState } from '@/features/strore';
import { getAsyncStorageData } from '@/features/slices/auth/AuthSlice';
import { checkTokenAndLogout } from '@/hooks/checkTokenAndLogout';

const WelcomeScreen = () => {
	const router = useRouter();
	const { width } = Dimensions.get('window');

	const handleVerify = async () => {
		try {
			// Check for the token in Secure Store
			// const token = await SecureStore.getItemAsync('token');
			const token = await getAsyncStorageData('token');
			if (token) {
				// Navigate to main tabs if token exists
				router.push('/(tabs)');
			} else {
				// Navigate to login page if token does not exist
				router.push('/auth/Login');
			}
		} catch (error) {
			console.error('Error verifying token:', error);
		}
	};

	useEffect(() => {
		const checkToken = async () => {
			const token = await getAsyncStorageData('token');

			// Check token validity, and if invalid, handle logout
			checkTokenAndLogout(token);
		};

		checkToken();
	}, []);
	return (
		<SafeAreaView className="flex-1 bg-white">
			{/* Main Content Container */}
			<View className="flex-1 justify-center items-center px-4">
				{/* Logo Section */}
				<View className="justify-center items-center mt-80 mb-32">
					<Image
						source={require('@/assets/solutionprovider_logo-removebg-preview.png')}
						style={{
							width: width * 0.8,
							height: undefined,
							aspectRatio: 5.5,
						}}
						resizeMode="contain"
					/>
				</View>

				{/* Welcome Text Section */}
				<View className="items-center mb-12">
					<Image
						source={require('@/assets/varify_your_identity.png')}
						style={{
							width: width * 0.5,
							height: undefined,
							aspectRatio: 3,
							resizeMode: 'contain',
						}}
					/>
				</View>

				{/* Verify Button */}
				<TouchableOpacity
					onPress={handleVerify}
					style={{
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Image
						source={require('@/assets/varify_button.png')}
						style={{
							width: width * 0.7,
							height: undefined,
							aspectRatio: 3,
							resizeMode: 'contain',
						}}
					/>
				</TouchableOpacity>

				{/* Footer Text */}
				<Text className="text-xs p-2 text-center text-sky-700 mt-4">
					© Solution Provider reserves all rights to this app under copyright
					law.
				</Text>
			</View>
		</SafeAreaView>
	);
};

export default WelcomeScreen;
