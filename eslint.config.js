import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                firebase: 'readonly',
                auth: 'readonly',
                Tawk_API: 'readonly',
                // აქ ვამატებთ Firebase-ის და სხვა გლობალურ ცვლადებს
            },
        },
        rules: {
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'no-unused-vars': 'warn',
            'no-undef': 'error',
            'no-console': 'off'
        }
    }
];