const getFileTypeFromURL = (url: string): string | null => {
	// Check if the URL contains "audioclip"
	if (url.includes('audioclip')) {
		return 'audio';
	}

	// Extract the file extension from the URL
	const extensionMatch = url.match(/\.([a-zA-Z0-9]+)(?:[\?#]|$)/);

	if (extensionMatch) {
		const extension = extensionMatch[1].toLowerCase();

		// Map extensions to file types
		const extensionToType: { [key: string]: string } = {
			jpg: 'image',
			jpeg: 'image',
			png: 'image',
			gif: 'image',
			mp4: 'video',
			mov: 'video',
			avi: 'video',
			mp3: 'audio',
			wav: 'audio',
			pdf: 'document',
			doc: 'document',
			docx: 'document',
			xls: 'document',
			xlsx: 'document',
			txt: 'text',
			zip: 'archive',
			// Add more mappings as needed
		};

		// Return the file type based on the extension
		return extensionToType[extension] || null;
	}

	// Check for patterns in the URL (e.g., Facebook video URLs)
	if (url?.includes('/v/t59.3654-21/') || url?.includes('/v/t42.3356-2/')) {
		return 'video';
	}

	// If no extension or pattern is found, return null
	return null;
};

export { getFileTypeFromURL };
