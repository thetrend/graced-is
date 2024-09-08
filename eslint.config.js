import tseslint from '@typescript-eslint/eslint-plugin'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginImport from 'eslint-plugin-import'
import configAirbnb from 'eslint-config-airbnb-typescript'

const baseConfig = {
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
  plugins: {
    react: pluginReact,
    '@typescript-eslint': tseslint,
    import: pluginImport,
    'react-hooks': pluginReactHooks,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off', // For React 17+ with the new JSX Transform
    'import/prefer-default-export': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // Add or override any other rules as needed
  },
}

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ...baseConfig,
    rules: {
      ...baseConfig.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...configAirbnb.rules,
    },
  },
]
