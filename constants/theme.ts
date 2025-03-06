import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
	...MD3LightTheme,
	colors: {
		...MD3LightTheme.colors,
		primary: '#046289',
		success: '#67A74A',
		danger: '#941F1F',
		background: '#FFF6F6', // Light background
		surface: '#FFF6F6',
		text: '#3C3C3B', // Dark text
		onSurface: '#3C3C3B',
	},
};

export const darkTheme = {
	...MD3DarkTheme,
	colors: {
		...MD3DarkTheme.colors,
		primary: '#046289',
		success: '#67A74A',
		danger: '#941F1F',
		background: '#121212', // Darker background for a true dark theme
		surface: '#1E1E1E', // Slightly lighter than background for surfaces
		text: '#E0E0E0', // Light gray text for readability
		onSurface: '#E0E0E0', // Consistent text color on surfaces
	},
};
