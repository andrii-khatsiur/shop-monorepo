# Project Overview

This is a `shop-monorepo` project designed for an e-commerce platform, leveraging **Bun** as the primary package manager and runtime. It is structured into multiple applications, each serving a distinct purpose within the e-commerce ecosystem. All applications are developed using **TypeScript**.

The monorepo comprises the following key applications:

*   **API (`apps/api`):** A backend service built with **Hono.js**. It provides a RESTful API for managing shop entities such as products, brands, and categories, and handles user authentication via Google OAuth. Logging is implemented using `pino` and `pino-pretty` for enhanced readability. Detailed API endpoints and data models are documented in `apps/api/API_DOCUMENTATION.md`.
*   **Admin (`apps/admin`):** A frontend administrative interface developed using **React**, styled with **Ant Design**, and managed with **React Router DOM**. This application is responsible for managing the shop's inventory, users, and other administrative tasks.
*   **Web (`apps/web`):** The public-facing storefront application, built with **Solid.js** and utilizing **Vinxi** for its development and build processes.

## Technologies Used

*   **Package Manager/Runtime:** Bun
*   **Backend Framework:** Hono.js
*   **Frontend Frameworks:** React (Admin), Solid.js (Web)
*   **UI Libraries:** Ant Design (Admin)
*   **Routing:** React Router DOM (Admin), Solid Router (Web)
*   **Build Tools:** Vinxi (Web), Bun's native bundler (Admin)
*   **Language:** TypeScript
*   **Logging:** Pino, Pino-pretty (API)

## Architecture

The project follows a monorepo architecture, allowing for shared configurations and streamlined development across different applications. Each application is self-contained within the `apps/` directory, while the root `package.json` orchestrates common tasks.

## Building and Running

The project uses `bun` scripts defined in the root `package.json` to manage development and build workflows.

### Common Commands

*   `bun dev`: Starts development servers for all applications (API, Admin, Web) concurrently.
*   `bun build`: Builds all applications for production.
*   `bun env:copy`: Executes a script to copy environment variables, which might be necessary before running certain applications.

### Application-Specific Commands

*   **API (`apps/api`):**
    *   `bun api:dev`: Starts the API development server with hot-reloading.
    *   `bun run --hot src/index.ts` (from `apps/api` directory)
*   **Admin (`apps/admin`):**
    *   `bun admin:dev`: Starts the Admin frontend development server.
    *   `bun --hot src/index.ts` (from `apps/admin` directory)
    *   `bun build ./src/index.html --outdir=dist ...`: Builds the Admin application.
*   **Web (`apps/web`):**
    *   `bun web:dev`: Starts the Web storefront development server, including an auto-open browser feature.
    *   `dotenv -e .env bun run dev:parallel` (from `apps/web` directory)
    *   `dotenv -e .env vinxi build`: Builds the Web application.
    *   `dotenv -e .env vinxi start`: Starts the built Web application.

## Development Conventions

*   **TypeScript First:** All new code should be written in TypeScript, adhering to strict type checking.
*   **Bun Ecosystem:** Leverage Bun's fast runtime and package management features.
*   **Monorepo Organization:** Maintain clear separation of concerns within the `apps/` directory for each application.
*   **Environment Variable Management:** Utilize `.env` files for configuration and `dotenv-cli` or custom scripts for loading them.
*   **Path Aliases:** Use `@apps/*`, `@packages/*`, `~/*`, or `@/*` aliases for module imports as defined in `tsconfig.json` files to simplify paths.
*   **Shared Types (packages/types):**
    *   Individual type definitions are placed in separate files (e.g., `packages/types/src/Brand.ts`).
    *   The `packages/types/src/index.ts` file re-exports these individual types for a clean package interface.
    *   Sub-projects consuming shared types must add the shared package as a `workspace:` dependency (e.g., `"@shop-monorepo/types": "workspace:^1.0.0"`).
    *   Use `import type { TypeName } from "package-name";` for importing only type information, which can aid bundler optimizations.
*   **End-to-End Type Safety:** Strive for type safety across the entire stack, from backend API responses to frontend UI components, by consistently using shared types.
