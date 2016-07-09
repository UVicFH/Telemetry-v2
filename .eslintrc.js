module.exports = {
	'env': {
		'browser': true,
		'es6': true,
		'node': true
	},
	'parser': 'babel-eslint',
	'extends': ['eslint:recommended', 'plugin:react/recommended'],
	'parserOptions': {
		'ecmaFeatures': {
			'experimentalObjectRestSpread': true,
			'jsx': true,
			'classes': true
		},
		'sourceType': 'module'
	},
	'plugins': [
		'react'
	],
	'rules': {
		'indent': [
			'warn',
			'tab',
			{'SwitchCase': 1}
		],
		'quotes': [
			'error',
			'single',
			{
				'avoidEscape': true,
				'allowTemplateLiterals': true
			}
		],
		'semi': [
			'error',
			'never'
		],
		'no-console': 1,
		'eol-last' : 1,
		'no-mixed-spaces-and-tabs':0,
		'no-unused-vars':1,
		'react/jsx-no-bind':1
	}
}
