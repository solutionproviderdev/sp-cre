import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

interface VoiceMessageProps {
	uri: string;
}

export default function VoiceMessage({ uri }: VoiceMessageProps) {
	const [sound, setSound] = useState<Audio.Sound | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [playbackStatus, setPlaybackStatus] = useState<any>(null);

	async function loadSound() {
		try {
			const { sound: newSound } = await Audio.Sound.createAsync(
				{ uri },
				{ shouldPlay: false },
				status => {
					setPlaybackStatus(status);
					if (status.didJustFinish) {
						// Reset playback so it doesn't loop
						newSound.setPositionAsync(0);
						newSound.stopAsync();
						setIsPlaying(false);
					}
				}
			);
			setSound(newSound);
		} catch (error) {
			console.error('Error loading sound:', error);
		}
	}

	useEffect(() => {
		loadSound();
		return () => {
			if (sound) {
				sound.unloadAsync();
			}
		};
	}, []);

	const handlePlayPause = async () => {
		if (!sound) return;
		if (isPlaying) {
			await sound.pauseAsync();
			setIsPlaying(false);
		} else {
			await sound.playAsync();
			setIsPlaying(true);
		}
	};

	// Compute progress percentage
	const progressPercentage =
		playbackStatus && playbackStatus.durationMillis
			? (playbackStatus.positionMillis / playbackStatus.durationMillis) * 100
			: 0;

	return (
		<View className="flex-col items-center space-x-3 p-2">
			<View className="flex-row items-center space-x-3 p-2">
				<TouchableOpacity onPress={handlePlayPause}>
					<Ionicons
						name={isPlaying ? 'pause' : 'play'}
						size={24}
						color="#046289"
					/>
				</TouchableOpacity>
				<Text className="text-sm text-gray-700">
					{playbackStatus
						? moment.utc(playbackStatus.positionMillis).format('mm:ss')
						: '00:00'}
				</Text>
			</View>
			{/* Progress Bar */}
			<View className="ml-2 w-full rounded">
				<View className="w-full h-2 bg-gray-300 rounded overflow-hidden">
					<View
						style={{ width: `${progressPercentage}%` }}
						className="h-full bg-[#046289] rounded"
					/>
				</View>
			</View>
		</View>
	);
}
