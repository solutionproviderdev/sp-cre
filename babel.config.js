module.exports = function (api) {
	api.cache(true);
	return {
		presets: [
			['babel-preset-expo', { jsxImportSource: 'nativewind' }],
			'nativewind/babel',
		],
		plugins: [
			// …any other plugins you use
			'react-native-reanimated/plugin', // Add this line as the last plugin
		],
	};
};
