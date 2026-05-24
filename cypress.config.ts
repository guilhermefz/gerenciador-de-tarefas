import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        specPattern: 'cypress/e2e/**/*.cy.ts',
        supportFile: 'cypress/support/e2e.ts',
        baseUrl: 'http://localhost:5173',
        env: {
            apiUrl: 'http://localhost:3001/api',
        },
    },
});
