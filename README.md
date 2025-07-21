# Dashboard Template

This is a demo project using Rsbuild and oxlint.

## Basic Features

- Display loading before API response
- The API responds successfully and updates the screen
- Use the previously cached data to display the screen, and re-get the API response, and update the screen after the API response
- Use the previously cached data to display the screen and will not re-get the API response

## 🚀 Getting Started

### Requirements

- [Node.JS](https://nodejs.org/en/download/) v22.x, please use [NVM](https://github.com/nvm-sh/nvm) or [FNM](https://github.com/Schniz/fnm) to install
- [PNPM](https://pnpm.io/) 10.x

### Useful Commands

```bash
# Install dependencies
pnpm install

# Start mock api server
pnpm mock-api

# Start development server
pnpm dev

# ESLint fix
pnpm lint

# Format code
pnpm format

# Build
pnpm build
```

### Project Structure

```text
.husky/ # Husky configuration
src/
├── components/ # Reusable React components, DataFetcher is the answer of Q4
│   └── ui/ # Shadcn UI components
├── constants/ # Application-wide constants
├── lib/
│   └── utils.ts # tailwindcss utils
├── providers/ # react query providers
├── types/ # Type definitions
├── App.tsx # Root component
├── global.css # Global styles
└── index.tsx # Entry point
mock-api.json # mock api by json-server
```
