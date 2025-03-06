import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { getFileTypeFromURL } from '@/hooks/getFileTypeFromURL';
import VoiceMessage from './VoiceMessage';
import VideoMessage from './VideoMessage';
import FullScreenImage from './FullScreenImage';
import { ProductAdForLead } from '@/features/metaAds/metaAds';

interface ChatsProps {
	messages: any[];
	isMessagesFetching: boolean;
	isMetaAdsFetching: boolean;
	metaAds: ProductAdForLead[];
}

interface MediaMessageProps {
	url: string;
}

const MediaMessage: React.FC<MediaMessageProps> = ({ url }) => {
	const fileType = getFileTypeFromURL(url);
	if (fileType === 'audio') {
		return <VoiceMessage uri={url} />;
	} else if (fileType === 'video') {
		return <VideoMessage uri={url} />;
	} else {
		// Default to image rendering with full-screen capability
		return <FullScreenImage src={url} />;
	}
};

const renderMessageContent = (msg: any) => {
	if (msg.fileUrl && msg.fileUrl.length > 0) {
		// If only one image, render normally.
		if (msg.fileUrl.length === 1) {
			return <MediaMessage url={msg.fileUrl[0]} />;
		}

		// Determine grid columns:
		// If more than 4 images, use 3 columns, else use 2 columns.
		const columns = msg.fileUrl.length > 4 ? 3 : 2;
		return (
			<View
				style={{
					flexDirection: 'row',
					flexWrap: 'wrap',
					justifyContent: 'space-between',
				}}
			>
				{msg.fileUrl.map((url: string, i: number) => (
					// Each image container takes equal width based on the column count.
					<View key={i} style={{ width: `${100 / columns}%`, padding: 2 }}>
						<MediaMessage url={url} />
					</View>
				))}
			</View>
		);
	}
	return (
		<Text className={`text-base ${msg.sentByMe ? 'text-white' : ''}`}>
			{msg.content}
		</Text>
	);
};

const renderMetaAds = (
	metaAds: ProductAdForLead[],
	isMetaAdsFetching: boolean
) => {
	if (isMetaAdsFetching) {
		return (
			<View className="space-y-2 p-2 bg-white w-full">
				{Array.from({ length: 2 }).map((_, idx) => (
					<View
						key={idx}
						className="p-2 border rounded-md flex-row items-center gap-2"
					>
						<View className="w-16 h-16 bg-gray-300 rounded" />
						<View className="flex-1 space-y-1">
							<View className="h-4 bg-gray-300 rounded w-3/5" />
							<View className="h-4 bg-gray-300 rounded w-3/5" />
						</View>
					</View>
				))}
			</View>
		);
	}
	if (metaAds && metaAds.length > 0) {
		return (
			<View className="space-y-2 p-2 bg-white">
				{metaAds.map((ad, idx) => (
					<View
						key={idx}
						className="p-2 border rounded-md flex-row items-center gap-2"
					>
						<View className="flex-1">
							<Text className="text-base font-semibold">{ad.name}</Text>
							<Text className="text-sm">
								{ad.description || 'No description'}
							</Text>
						</View>
						{ad.images && ad.images.length > 0 ? (
							ad.images.map((img, i) => (
								<Image
									key={i}
									source={{ uri: img.url }}
									className="h-16 w-16 object-cover rounded-md"
								/>
							))
						) : (
							<View className="w-16 h-16 bg-gray-300 rounded" />
						)}
					</View>
				))}
			</View>
		);
	}
	return null;
};

const Chats: React.FC<ChatsProps> = ({
	messages,
	isMessagesFetching,
	isMetaAdsFetching,
	metaAds,
}) => {
	// For mobile, you might not use a scrollable skeleton view as in web.
	if (isMessagesFetching) {
		return (
			<View className="px-2 py-1 space-y-2 h-full bg-white">
				{Array.from({ length: 4 }).map((_, index) => {
					const randomAlignment =
						Math.random() > 0.5 ? 'self-end' : 'self-start';
					const randomWidth = `${Math.floor(Math.random() * 31) + 50}%`;
					const randomHeight = Math.floor(Math.random() * 21) + 30;
					return (
						<View
							key={index}
							style={{ alignSelf: randomAlignment, marginBottom: 8 }}
						>
							<View
								style={{
									width: randomWidth,
									height: randomHeight,
									backgroundColor: '#ccc',
									borderRadius: 4,
								}}
							/>
						</View>
					);
				})}
			</View>
		);
	}

	return (
		<View className="flex-1 relative">
			{/* Meta Ads Section (sticky at top) */}
			<View className="sticky top-0 z-10">
				{renderMetaAds(metaAds, isMetaAdsFetching)}
			</View>
			<View className="px-2 py-1 space-y-2">
				{messages.map((msg, index) => {
					const bubbleAlignment = msg.sentByMe
						? 'self-end bg-[#046289] text-white'
						: 'self-start bg-gray-200 text-black';
					return (
						<View
							key={msg._id || index}
							className={`mb-3 rounded-lg px-3 py-2 max-w-[80%] ${bubbleAlignment}`}
						>
							{renderMessageContent(msg)}
							<Text
								className={`text-xs ${
									msg.sentByMe ? 'text-white' : 'text-gray-700'
								} mt-1 self-end`}
							>
								{moment(msg.date).format('hh:mm A')}
							</Text>
						</View>
					);
				})}
			</View>
		</View>
	);
};

export default Chats;
