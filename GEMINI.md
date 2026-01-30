GEMINI.md - Project Architecture & Coding Standards

1. Project Identity & Stack

Framework: Next.js 16 (App Router)

Language: TypeScript (Strict)

Backend: Appwrite (BaaS)

State Management: TanStack Query v5 (React Query)

Styling: Tailwind CSS v4 + Shadcn UI

Icons: Lucide React

2. Directory Structure & Organization

We strictly adhere to a modular architecture. All logic is separated into Actions (Server) and Hooks (Client).

src/
├── actions/ # SERVER ACTIONS ('use server')
│ ├── auth.ts # login, register, logout
│ ├── user.ts # fetchUser, updateUser
│ └── [feature].ts
├── app/ # NEXT.JS ROUTING
│ ├── (auth)/ # Authentication routes
│ ├── (dashboard)/ # Protected routes
│ └── layout.tsx
├── components/ # UI COMPONENTS
│ ├── ui/ # Shadcn primitives (do not modify logic here)
│ ├── auth/ # Feature-specific components
│ └── shared/ # Layout components
├── hooks/ # CUSTOM HOOKS
│ ├── queries/ # useFetch[Name] (React Query wrappers)
│ ├── mutations/ # use[Action][Name] (Mutations)
│ └── ui/ # useScroll, useSidebar
├── lib/
│ ├── appwrite.ts # Appwrite SDK Configuration
│ ├── query-client.ts # React Query Client setup
│ └── utils.ts # CN utility
└── types/ # GLOBAL TYPES

3. Naming Conventions (Strict)

A. Server Actions (@/actions)

File Location: src/actions/[feature].ts

Directive: Must start with 'use server'

Prefix: fetch (Read), create, update, delete (Write)

Format:

// src/actions/user.ts
'use server'
export async function fetchUserProfile(userId: string) { ... }
export async function updateUserAvatar(formData: FormData) { ... }

B. React Hooks (@/hooks)

File Location: src/hooks/[type]/use-[name].ts

Prefix: use

Format:

Queries: useFetch[Resource] (e.g., useFetchProjects)

Mutations: use[Verb][Resource] (e.g., useCreateProject, useLoginUser)

4. Implementation Guidelines

Appwrite Integration

Server Side: Use node-appwrite inside @/actions to handle session cookies securely.

Authentication: Never expose API keys. Use the Session Client pattern for all authenticated actions.

React Query Pattern

Do not call Server Actions directly in useEffect.

Do wrap Server Actions in React Query hooks.

Example: The "Fetch" Flow

Action: src/actions/todo.ts -> export const fetchTodos = async () => ...

Hook: src/hooks/queries/use-fetch-todos.ts

import { useQuery } from '@tanstack/react-query';
import { fetchTodos } from '@/actions/todo';

export const useFetchTodos = () => {
return useQuery({
queryKey: ['todos'],
queryFn: () => fetchTodos(),
});
};

UI & Styling (Tailwind v4)

Config: Use CSS variables in globals.css (@theme). Do not look for tailwind.config.js.

Components: Use Shadcn primitives from @/components/ui.

Classes: Keep it clean. Use clsx or cn for conditional styling.

5. Performance & Mobile Standards (MANDATORY)

A. Next.js & React Optimization

React Compiler: Assume reactCompiler is enabled. Do not use useMemo or useCallback unless strictly necessary for referential equality in dependency arrays.

Imports: Use specific imports for icons (e.g., import { User } from 'lucide-react') to enable tree-shaking.

B. Appwrite Data Efficiency

Selective Fetching: Always use Query.select([]) in databases.listDocuments to fetch only fields displayed in the UI.

Images: NEVER render raw Appwrite file URLs. Always use storage.getFilePreview() with width, height, and output: 'webp' to serve optimized images for mobile.

C. Mobile-First UI (Tailwind v4)

Viewport: Use h-dvh (Dynamic Viewport Height) instead of h-screen for full-height mobile layouts.

Touch Targets: Interactive elements must have min-h-[44px] and min-w-[44px].

Inputs: Set text-base (16px) on inputs for mobile breakpoints to prevent iOS auto-zoom.

Container Queries: Prefer @container and @md: (container query) over md: (media query) for card components to ensure they are reusable in any grid column width.

6. Output Rules for AI

Always verify the folder path before generating code.

Always use the defined naming conventions (fetch..., use...).

Always separate logic: Data fetching goes to @/actions, State goes to @/hooks.

Never put direct database logic inside UI components (app or components).

Always apply "Performance & Mobile Standards" to generated code.
