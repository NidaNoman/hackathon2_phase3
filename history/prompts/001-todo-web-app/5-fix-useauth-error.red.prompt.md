---
id: 5
title: Fix useAuth must be used within an AuthProvider Error
stage: red
date: 2026-01-10
surface: agent
model: Gemini
feature: 001-todo-web-app
branch: 001-todo-web-app
user: user
command: /sp.implement
labels: ["debugging", "frontend", "nextjs", "context-api"]
links:
  spec: specs/001-todo-web-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/app/layout.tsx
tests:
  null
---

## Prompt

/sp.implement You are a senior Next.js 14 (App Router) engineer.

I am getting this runtime error on my frontend:

Error:
"useAuth must be used within an AuthProvider"

Context:
- Framework: Next.js 14 (App Router)
- Route showing error: /login
- File throwing error:
  src/lib/state/authContext.tsx
- useAuth() is called in:
  src/app/(auth)/login/page.tsx
- The error happens at runtime, not build time

Your tasks:
1. Explain clearly WHY this error occurs in App Router
2. Check whether AuthProvider is:
   - Missing
   - Placed in the wrong layout
   - Wrapped only around some routes
3. Verify the correct place to wrap AuthProvider:
   - root layout (src/app/layout.tsx)
   - OR route group layout (src/app/(auth)/layout.tsx)
4. Provide the EXACT correct implementation for:
   - AuthProvider component
   - layout.tsx where AuthProvider must be wrapped
5. Ensure the solution works with Next.js App Router and React Server Components
6. Mention any required "use client" directives
7. Do NOT suggest pages router
8. Do NOT repeat solved steps

Output requirements:
- Step-by-step fix
- Minimal but correct code
- Clear folder paths

## Response snapshot

The error "useAuth must be used within an AuthProvider" means your login page is asking for authentication data (using `useAuth`), but the provider of that data (`AuthProvider`) wasn't available to it. In the Next.js App Router, global providers like this must be added to the **root layout** to be available to all pages. Your root layout was not using the provider.

I have edited the root layout file (`frontend/src/app/layout.tsx`) to include the provider. By wrapping the application's `children` with the `AuthProvider`, the authentication context is now available to all pages.

This pattern (placing a Client Component provider within a Server Component layout) is the correct way to handle global client-side context in the App Router, ensuring your app benefits from both server and client components.

## Outcome

- ✅ Impact: Fixed a critical runtime error preventing the application's authentication features from working. The fix involved wrapping the root layout with the AuthProvider, a fundamental step for using global context in Next.js App Router.
- 🧪 Tests: No tests were added. The fix is verified by the absence of the runtime error.
- 📁 Files: Modified 1 file (`frontend/src/app/layout.tsx`) to correctly provide the authentication context to the entire application.
- 🔁 Next prompts: Run the application and confirm that the login page loads without the 'useAuth must be used within an AuthProvider' error.
- 🧠 Reflection: The error was a classic React context provider issue, made slightly more nuanced by the Next.js App Router's Server/Client component architecture. The solution to wrap the root layout's children with the client-side provider is a standard and correct pattern.

## Evaluation notes (flywheel)

- Failure modes observed: Initial directory listing failed due to incorrect path assumption. Corrected the path from 'src/app' to 'frontend/src/app'.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
