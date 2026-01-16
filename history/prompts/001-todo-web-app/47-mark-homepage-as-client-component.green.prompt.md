---
id: 47
title: Mark HomePage as Client Component
stage: green
date: 2026-01-15
surface: agent
model: gemini
feature: 001-todo-web-app
branch: 
user: 
command: /sp.implement
labels: [frontend, nextjs, client-component, bugfix]
links:
  spec: 
  ticket: 
  adr: 
  pr: 
files:
 - frontend/src/app/page.tsx
tests:

---

## Prompt

Unhandled Runtime Error
Error: useRouter only works in Client Components. Add the "use client" directive at the top of the file to use it. Read more: https://nextjs.org/docs/messages/react-client-hook-in-server-component

## Response snapshot

I have addressed the `Unhandled Runtime Error: useRouter only works in Client Components`.

The `useRouter` hook is a client-side React hook and can only be used within Client Components in Next.js App Router. The error occurred because `frontend/src/app/page.tsx` was implicitly being treated as a Server Component.

I have fixed this by adding the `"use client";` directive at the very top of `frontend/src/app/page.tsx`, explicitly marking it as a Client Component.

```typescript
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  // ... rest of the component
}
```

This change ensures that `useRouter` is used in the appropriate component type, resolving the runtime error.

## Outcome

- ✅ Impact: Resolved a critical frontend runtime error related to Client/Server Component boundaries in Next.js App Router.
- 🧪 Tests: No new tests were added.
- 📁 Files: 
  - `frontend/src/app/page.tsx`
- 🔁 Next prompts: The `HomePage` component should now render without the `useRouter` error.
- 🧠 Reflection: Understanding Next.js Client/Server Component boundaries and the correct usage of directives like `"use client"` is crucial for developing robust App Router applications.

## Evaluation notes (flywheel)

- Failure modes observed: The application was crashing due to incorrect usage of a client-side hook in a server-side context.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): 
- Next experiment (smallest change to try): 
