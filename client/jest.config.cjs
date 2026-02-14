module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/src/__mocks__/fileMock.js",
    "^@/components/ui/(.*)$": "<rootDir>/src/__mocks__/uiComponentsMock.js",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^react-router-dom$": "<rootDir>/src/__mocks__/reactRouterDomMock.js",
  },
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@tanstack|lucide-react|react-router|react-router-dom)/)",
  ],
};
