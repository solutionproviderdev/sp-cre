import React, { useState, useEffect, useRef } from 'react';
import {
	View,
	Text,
	TextInput,
	ScrollView,
	TouchableOpacity,
	Animated,
	Easing,
	Linking,
	Image,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import {
	useGetConversationMessagesQuery,
	useGetSingleLeadQuery,
	useSentMessageMutation,
} from '@/features/slices/conversation/ConversationAPI';
import { useUploadMultipleImagesMutation } from '@/features/upload/upload';
import { useGetProductAdsForLeadQuery } from '@/features/metaAds/metaAds';
import Chats from '@/components/Chats';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native-paper';

export default function ConversationInboxScreen() {
	const { conversationId } = useLocalSearchParams();
	const router = useRouter();

	// Local states
	const [messages, setMessages] = useState<any[]>([]);
	const [newMessage, setNewMessage] = useState('');
	const [selectedImages, setSelectedImages] = useState<string[]>([]);

	// Toast/snackbar states
	const [toastMessage, setToastMessage] = useState('');
	const [showToast, setShowToast] = useState(false);
	const toastOpacity = useRef(new Animated.Value(0)).current;

	// Ref for auto-scrolling
	const scrollViewRef = useRef<ScrollView>(null);

	// Queries
	const { data: lead, isFetching: isLeadDetailsFetching } =
		useGetSingleLeadQuery(conversationId as string, {
			skip: !conversationId,
			refetchOnMountOrArgChange: true,
		});

	const { data: messageData, isFetching: isMessagesFetching } =
		useGetConversationMessagesQuery(conversationId as string, {
			skip: !conversationId,
			refetchOnMountOrArgChange: true,
		});

	const { data: metaAds, isFetching: isMetaAdsFetching } =
		useGetProductAdsForLeadQuery(conversationId as string, {
			skip: !conversationId || !(lead?.productAds?.length > 0),
			refetchOnMountOrArgChange: true,
		});

	const [sendMessage, { isLoading: isSending }] = useSentMessageMutation();
	const [uploadMultipleImages] = useUploadMultipleImagesMutation();

	// Load messages from query
	useEffect(() => {
		if (messageData?.messages) {
			setMessages(messageData.messages);
		}
	}, [messageData]);

	// Auto-scroll when messages update
	useEffect(() => {
		scrollViewRef.current?.scrollToEnd({ animated: true });
	}, [messages]);

	// Clear inputs when lead changes
	useEffect(() => {
		setNewMessage('');
		setSelectedImages([]);
	}, [lead]);

	const showErrorToast = (message: string) => {
		setToastMessage(message);
		setShowToast(true);
		Animated.timing(toastOpacity, {
			toValue: 1,
			duration: 200,
			useNativeDriver: true,
			easing: Easing.out(Easing.quad),
		}).start(() => {
			setTimeout(() => {
				Animated.timing(toastOpacity, {
					toValue: 0,
					duration: 200,
					useNativeDriver: true,
				}).start(() => setShowToast(false));
			}, 3000);
		});
	};

	// Image upload using expo-image-picker and uploadMultipleImages
	const handleImageUpload = async () => {
		try {
			const permissionResult =
				await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (!permissionResult.granted) {
				showErrorToast('Permission to access camera roll is required!');
				return;
			}
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsMultipleSelection: true,
				quality: 0.7,
			});
			if (!result.canceled) {
				// Create a new FormData instance and append each selected image.
				const formData = new FormData();
				(result.assets || []).forEach(asset => {
					// Note: Adjust field name and file details as needed.
					formData.append('images', {
						uri: asset.uri,
						name: asset.uri.split('/').pop() || `image.jpg`,
						type: 'image/jpeg',
					} as any);
				});
				// Call the upload function.
				const response = await uploadMultipleImages(formData).unwrap();
				if (response?.fileUrls) {
					// Replace selectedImages with the returned URLs.
					setSelectedImages(response.fileUrls);
				} else {
					showErrorToast('Image upload failed.');
				}
			}
		} catch (error) {
			console.error('Error uploading images:', error);
			showErrorToast('Failed to upload images.');
		}
	};

	// {
	// "messageType": "image",
	// "content": {
	//     "urls": [
	//         "http://crm.solutionprovider.com.bd/api/images/images_1741205198947.jpg"
	//     ]
	// }
	// }
	// {"messageType":"image","content":{"urls":["http://192.168.68.130/api/images/images_1741205387712.jpeg"]}}

	const handleRemoveImage = (index: number) => {
		setSelectedImages(prev => prev.filter((_, i) => i !== index));
	};

	const handleSendMessage = async () => {
		if ((newMessage.trim() || selectedImages.length > 0) && conversationId) {
			try {
				// If images are selected, send them as an image message.
				await sendMessage({
					id: conversationId as string,
					message: {
						messageType: selectedImages.length > 0 ? 'image' : 'text',
						content:
							selectedImages.length > 0
								? { urls: selectedImages }
								: { text: newMessage },
					},
				}).unwrap();
				setNewMessage('');
				setSelectedImages([]);
			} catch (err) {
				console.error('Failed to send message:', err);
				showErrorToast('Failed to send message.');
			}
		}
	};

	const handlePhoneCall = (phone: string) => {
		const url = `tel:${phone}`;
		Linking.openURL(url).catch(err => {
			console.error('Failed to open phone dialer', err);
			showErrorToast('Failed to open phone dialer.');
		});
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			{/* Header */}
			<View className="flex-row items-center justify-between p-3 border-b border-gray-200">
				{isLeadDetailsFetching ? (
					<View className="flex-row items-center">
						<View className="w-10 h-10 rounded-full bg-gray-300 mr-2" />
						<View className="w-28 h-5 bg-gray-300 rounded" />
					</View>
				) : (
					<Text className="text-lg font-semibold text-gray-800">
						{lead?.name ?? 'Lead Name'}
					</Text>
				)}
				<View className="flex-row items-center">
					{lead?.phone && (
						<TouchableOpacity
							className="ml-2 p-1"
							onPress={() => handlePhoneCall(lead.phone)}
						>
							<Ionicons name="call" size={24} color="#046289" />
						</TouchableOpacity>
					)}
					{lead?.status && (
						<View className="ml-2">
							<Text className="text-base text-white rounded-sm px-1.5 py-0.5 bg-[#046289]">
								{lead.status}
							</Text>
						</View>
					)}
					<TouchableOpacity className="ml-2 p-1" onPress={() => {}}>
						<FontAwesome name="info-circle" size={24} color="#046289" />
					</TouchableOpacity>
				</View>
			</View>

			{/* Messages Section using Chats component */}
			<ScrollView ref={scrollViewRef} className="flex-1">
				<Chats
					messages={messages}
					isMessagesFetching={isMessagesFetching}
					isMetaAdsFetching={isMetaAdsFetching}
					metaAds={metaAds || []}
				/>
			</ScrollView>

			{/* Selected Images Preview */}
			{selectedImages.length > 0 && (
				<ScrollView
					horizontal
					className="max-h-[110px] bg-gray-100 py-1 px-2"
					contentContainerStyle={{ alignItems: 'center' }}
				>
					{selectedImages.map((image, idx) => (
						<View key={idx} className="relative mr-3">
							<Image source={{ uri: image }} className="w-24 h-24 rounded" />
							<TouchableOpacity
								onPress={() => handleRemoveImage(idx)}
								className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
							>
								<Ionicons name="close" size={14} color="#fff" />
							</TouchableOpacity>
						</View>
					))}
				</ScrollView>
			)}

			{/* Input Box */}
			<View className="flex-row items-center border-t border-gray-200 py-2 px-2">
				<TouchableOpacity className="p-1" onPress={handleImageUpload}>
					<Ionicons name="camera-outline" size={24} color="#000" />
				</TouchableOpacity>
				<TextInput
					className="flex-1 mx-2 bg-white px-3 py-2 rounded border border-gray-300"
					placeholder="Send message"
					value={newMessage}
					onChangeText={setNewMessage}
					onSubmitEditing={handleSendMessage}
					editable={!isSending}
				/>
				<TouchableOpacity
					className="p-1"
					onPress={handleSendMessage}
					disabled={isSending}
				>
					{isSending ? (
						<ActivityIndicator size="small" color="#046289" />
					) : (
						<Ionicons name="send" size={24} color="#046289" />
					)}
				</TouchableOpacity>
			</View>

			{/* Toast (Snackbar) */}
			{showToast && (
				<Animated.View
					style={{
						opacity: toastOpacity,
						position: 'absolute',
						top: 50,
						left: 10,
						right: 10,
						zIndex: 999,
					}}
					className="bg-red-600 p-3 rounded-md"
				>
					<Text className="text-white text-sm">{toastMessage}</Text>
				</Animated.View>
			)}
		</SafeAreaView>
	);
}
