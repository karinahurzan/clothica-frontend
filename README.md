## Clothica Frontend

Clothica Frontend is a Next.js 16 application that delivers the customer-facing experience for an online fashion marketplace. It exposes public catalog pages, category exploration, product detail views, and authenticated areas for profile management and order history. The app integrates with a backend API for catalog data, checkout, and user accounts, and uses modern UI patterns (carousels, drawers, modals) to provide a polished shopping journey.

### Key Features

- Responsive storefront with category and product discovery flows
- Authenticated profile and order management backed by NextAuth
- Feedback collection and ratings surfaced through reusable UI components
- Client-side state powered by React Query and Zustand for fast navigation
- Tailwind CSS 4 utility-first styling with custom component primitives

### Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS 4, modern-normalize
- State & Forms: TanStack Query, Zustand, React Hook Form, Zod validation
- UI: Radix UI primitives, Embla carousel, Sonner notifications
- Auth: NextAuth with middleware-protected routes

### Prerequisites

- Node.js 18.18+ or 20+
- npm 9+ (or an alternative package manager such as pnpm, yarn, or bun)

### Environment Variables

Create a `.env.local` file at the project root with the following variables:

```bash
NEXT_PUBLIC_API_URL="https://your-api.example.com"
NEXTAUTH_SECRET="replace-with-secure-random-string"
```

> `NEXT_PUBLIC_API_URL` must point to the backend REST API that serves catalog, orders, and profile data. `NEXTAUTH_SECRET` secures session tokens and should only be shared between the frontend and authentication backend.

If you deploy to another environment, mirror these values in the corresponding `.env` file for that target.

### Local Development

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

The app will be available at http://localhost:3000. Hot-module replacement is enabled for rapid iteration.

### Production Build

Create an optimized bundle and serve it locally to validate production behavior:

```bash
npm run build
npm run start
```

### Linting

Run static analysis to enforce coding standards and catch common issues:

```bash
npm run lint
```

### Project Structure

- `src/app` – App Router entry points, layouts, and route groups for public and private views
- `src/components` – Presentation layer components, organized by domain (categories, commerce, feedbacks, layout, shared UI)
- `src/domains` – API-facing domain modules encapsulating service calls and typed contracts
- `src/lib` – Axios client configuration, shared utilities, error handling helpers
- `src/store` – Zustand store(s) for client-side state management
- `src/utils` – Formatting helpers for dates and feedback data

### Testing Checklist

- Verify public storefront pages render with mock data
- Confirm authentication flows (login, sign-up) succeed against your backend
- Ensure protected routes redirect unauthenticated users to login
- Place test orders and inspect them in the profile section
- Review lint and build output before merging changes
