/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'], // Corrected 'componenets' typo
	presets: [require('nativewind/preset')],
	darkMode: 'class', // Enable class-based dark mode
	theme: {
		extend: {
			colors: {
				primary: '#046289',
				success: '#67A74A',
				danger: '#941F1F',
				background: {
					light: '#FFF6F6', // Light background
					dark: '#121212', // Dark theme background (true dark)
				},
				surface: {
					light: '#FFF6F6', // Light surface
					dark: '#1E1E1E', // Dark surface
				},
				text: {
					light: '#3C3C3B', // Light text
					dark: '#E0E0E0', // Dark text
				},
			},
		},
	},
	plugins: [],
};
