module.exports = {
  displayName: 'web',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Ensure single React instance (pnpm may hoist a different version)
    '^react$': require.resolve('react'),
    '^react-dom$': require.resolve('react-dom'),
    '^react-dom/(.*)$': require.resolve('react-dom') + '/../$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/web',
  testPathIgnorePatterns: ['/node_modules/', '/legacy-v3/']
};
