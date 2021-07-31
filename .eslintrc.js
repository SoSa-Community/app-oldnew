module.exports = {
	root: true,
	extends: ['@react-native-community', 'prettier'],
	plugins: ['prettier', 'react-hooks'],
	env: { jest: true },
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
	},
	parser: 'babel-eslint',
	rules: {
		'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
		'react-hooks/exhaustive-deps': 'off', // Checks effect dependencies
		'prettier/prettier': [
			'error',
			{
				endOfLine: 'auto',
			},
		],
	},
};
