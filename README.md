# Task Manager Frontend

Beautiful React frontend for Task Manager application.

## Features
- Authentication (Login/Register)
- Task CRUD operations
- Real-time search and filtering
- Pagination
- Responsive design
- Modern UI with Tailwind CSS

## Quick Start

```bash
npm install
npm run dev
```

Frontend runs on: http://localhost:3000
Backend must be running on: http://localhost:5000

## Build for Production

```bash
npm run build
```
# Folder structure
```
.
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── public
│   └── icons.svg
├── README.md
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   │   └── vite.svg
│   ├── components
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── TaskCard.tsx
│   │   └── TaskModal.tsx
│   ├── context
│   │   └── AuthContext.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── pages
│   │   ├── DashboardPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   └── services
│       └── api.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

8 directories, 24 files
```
