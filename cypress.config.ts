import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import { defineConfig } from 'cypress';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');

export default defineConfig({
    e2e: {
        specPattern: 'cypress/e2e/**/*.feature',
        supportFile: 'cypress/support/e2e.ts',
        async setupNodeEvents(on, config) {
            await addCucumberPreprocessorPlugin(on, config);
            on('file:preprocessor', createBundler({ plugins: [createEsbuildPlugin(config)] }));

            return config;
        },
        baseUrl: 'http://localhost:5173',
        env: {
            apiUrl: 'http://localhost:5000/api',
        },
    },
});
