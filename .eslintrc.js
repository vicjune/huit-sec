module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react/recommended',
    '@react-native-community',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  ignorePatterns: ['node_modules/', 'scripts/'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'react'],
  env: {
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'no-var': ['error'], // Use const or let instead (es6)
    'no-console': ['warn', { allow: ['warn', 'error'] }], // So we don't forget some console.log
    'no-else-return': ['warn'], // Cleaner to use early return
    'no-useless-return': ['warn'], // Can be a source of bugs
    'no-shadow': ['warn'], // Can be a source of bugs
    yoda: ['warn'], // false === var is not pretty
    'no-undef-init': ['warn'], // const toto = undefined is useless
    'prefer-arrow-callback': ['warn'], // Cleaner and easier to read
    'prefer-const': ['warn'], // Can be a source of bugs
    'prefer-destructuring': ['warn'], // Cleaner and easier to read
    'prefer-spread': ['warn'], // Cleaner and easier to read
    'no-useless-rename': ['warn'], // Cleaner and easier to read
    'object-shorthand': ['warn'], // Cleaner and easier to read
    'prefer-template': ['warn'], // Use es6 string template instead of concatenation
    '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'], // Use interface instead of type = Obj
    '@typescript-eslint/no-require-imports': ['warn'], // Use es6 import instead of require
    '@typescript-eslint/ban-types': [
      'warn',
      {
        types: {
          // Function type is too generic
          Function: {
            message: 'Use (...args: unknown[]) => unknown instead',
          },
        },
      },
    ],
    '@typescript-eslint/array-type': ['warn'], // Use T[] instead of Array<T>, cleaner
    'import/no-default-export': ['warn'], // Don't use export default, prone to bugs

    'prettier/prettier': 'off',

    // Overrides eslint:recommended
    'no-extra-boolean-cast': 'warn', // Error -> Warn
    'no-debugger': 'warn', // Error -> Warn
    'no-empty': ['warn', { allowEmptyCatch: true }], // Error -> Warn + Allow catch blocks to be empty
    'no-regex-spaces': 'warn', // Error -> Warn
    'no-unexpected-multiline': 'warn', // Error -> Warn
    'no-unreachable': 'warn', // Error -> Warn
    'use-isnan': 'warn', // Error -> Warn
    'no-empty-pattern': 'warn', // Error -> Warn
    'no-useless-catch': 'warn', // Error -> Warn
    'no-useless-escape': 'warn', // Error -> Warn
    'no-mixed-spaces-and-tabs': 'warn', // Error -> Warn
    'no-constant-condition': 'warn', // Error -> Warn
    'constructor-super': 'off', // Not all constructors need to call super();

    // Overrides plugin:@typescript-eslint/recommended
    '@typescript-eslint/no-empty-interface': 'warn', // Error -> Warn
    '@typescript-eslint/no-inferrable-types': 'warn', // Error -> Warn
    '@typescript-eslint/no-var-requires': 'warn', // Error -> Warn
    '@typescript-eslint/prefer-namespace-keyword': 'warn', // Error -> Warn
    '@typescript-eslint/triple-slash-reference': 'warn', // Error -> Warn
    '@typescript-eslint/explicit-function-return-type': 'off', // Some return types are explicits
    '@typescript-eslint/no-explicit-any': 'off', // Too much constraint
    '@typescript-eslint/no-non-null-assertion': 'off', // foo.bar!.baz can be useful
    '@typescript-eslint/prefer-string-starts-ends-with': 'off', // Use whatever you want to check strings
    '@typescript-eslint/no-use-before-define': 'off', // Declaration order doesn't matter
    '@typescript-eslint/camelcase': 'off', // Name your variables whatever you want
    '@typescript-eslint/no-empty-function': 'off', // Some functions needs to be empty () => {}
    '@typescript-eslint/member-delimiter-style': 'off', // Handled by prettier
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Not requiring return type on exported functions
    '@typescript-eslint/ban-ts-comment': 'off',

    // Overrides plugin:import/errors and plugin:import/warnings
    'import/no-unresolved': 'off', // Handled by typescript
    'import/default': 'off', // Handled by typescript
    'import/named': 'off', // Handled by typescript
    'import/namespace': 'off', // Handled by typescript

    // Overrides plugin:react/recommended
    'react/jsx-key': 'warn', // Error -> Warn
    'react/jsx-no-target-blank': 'warn', // Error -> Warn
    'react/display-name': 'off', // We don't use display name
    'react/jsx-no-undef': 'off', // Handled by Typescript
    'react/prop-types': 'off', // Handled by Typescript
    'react/no-unescaped-entities': 'off', // Allow to write special characters in templates

    // Overrides @react-native-community
    'react-hooks/exhaustive-deps': 'warn',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-unused-vars': 'off', // Replaced by @typescript-eslint/no-unused-vars
        '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }], // Replaces no-unused-vars
        'no-shadow': 'off', // Replaced by @typescript-eslint/no-shadow
        '@typescript-eslint/no-shadow': ['warn'], // Replaces no-shadow
      },
    },
  ],
};
