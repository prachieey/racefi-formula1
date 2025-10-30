const { defineConfig } = require('cypress');
const { initPlugin } = require('cypress-plugin-snapshots/plugin');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      // Implement node event listeners here
      initPlugin(on, config);
      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    chromeWebSecurity: false,
  },
  env: {
    'cypress-plugin-snapshots': {
      serverPort: 8888,
      serverHost: 'localhost',
      autoCleanUp: true,
    },
  },
});
