module.exports = {
	root: true,
	extends: ['@react-native-community', 'prettier'],
	plugins: ['prettier'],
	env: { jest: true },
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
	},
	parser: 'babel-eslint',
};
