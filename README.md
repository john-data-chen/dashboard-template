# Dashboard Template

這是使用 Rsbuild 和 oxlint 的 demo 專案

## Basic Features

- API回應前顯示加載中
- API成功回應後更新畫面
- 使用之前緩存的資料顯示畫面，並同時重新拿取API回應，並在API回應後更新畫面
- 使用之前緩存的資料顯示畫面，並不會重新拿取API回應

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
├── components/ # Reusable React components, DataFetcher.tsx 就是題目四要驗收的通用組件
│   └── ui/ # Shadcn UI components
├── constants/ # Application-wide constants
├── hooks/ # Custom React hooks
├── lib/
│   └── utils.ts # tailwindcss utils
├── types/ # Type definitions
├── App.tsx # Root component
├── global.css # Global styles
└── index.tsx # Entry point
```
