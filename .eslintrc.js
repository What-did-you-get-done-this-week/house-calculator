module.exports = {
  // ... other config ...
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { 
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_' 
    }]
  }
} 