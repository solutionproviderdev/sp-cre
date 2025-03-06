import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

interface VideoMessageProps {
	uri: string;
}

export default function VideoMessage({ uri }: VideoMessageProps) {
	const videoRef = useRef<Video>(null);
	const [status, setStatus] = useState<AVPlaybackStatus | null>(null);

	const handlePress = async () => {
		if (status?.isPlaying) {
			await videoRef.current?.pauseAsync();
		} else {
			await videoRef.current?.playAsync();
		}
	};

	return (
		<TouchableOpacity
			onPress={handlePress}
			activeOpacity={0.9}
			style={styles.container}
		>
			<Video
				ref={videoRef}
				source={{ uri }}
				style={styles.video}
				resizeMode="cover"
				shouldPlay={false}
				isLooping={false}
				onPlaybackStatusUpdate={status => {
					setStatus(status);
					if (status.didJustFinish) {
						videoRef.current?.pauseAsync();
						videoRef.current?.setPositionAsync(0);
					}
				}}
			/>
			{!status?.isPlaying && (
				<View style={styles.overlay}>
					<Ionicons name="play-circle-outline" size={48} color="white" />
				</View>
			)}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		width: 160,
		height: 120,
		borderRadius: 8,
		overflow: 'hidden',
		backgroundColor: 'black',
		marginBottom: 8,
	},
	video: {
		width: '100%',
		height: '100%',
	},
	overlay: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
