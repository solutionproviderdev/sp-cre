import React, { useState } from 'react';
import { Modal, Image, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FullScreenImageProps {
	src: string;
	alt?: string;
	// className for thumbnail styling
	className?: string;
}

export default function FullScreenImage({
	src,
	alt,
	className = 'w-40 h-40 mb-2 rounded object-cover',
}: FullScreenImageProps) {
	const [modalVisible, setModalVisible] = useState(false);

	return (
		<>
			{/* Thumbnail */}
			<TouchableOpacity onPress={() => setModalVisible(true)}>
				<Image source={{ uri: src }} className={className} />
			</TouchableOpacity>

			{/* Full-Screen Modal */}
			<Modal
				visible={modalVisible}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setModalVisible(false)}
			>
				<TouchableOpacity
					className="flex-1 bg-black/90 justify-center items-center"
					activeOpacity={1}
					onPress={() => setModalVisible(false)}
				>
					<Image
						source={{ uri: src }}
						className="w-full h-96 object-contain"
					/>
					<TouchableOpacity
						onPress={() => setModalVisible(false)}
						className="absolute top-10 right-5 p-2"
					>
						<Ionicons name="close" size={32} color="white" />
					</TouchableOpacity>
				</TouchableOpacity>
			</Modal>
		</>
	);
}
