---
id: 20
title: Fix Client Component Error in Tasks Page
stage: red
date: 2026-01-13
surface: agent
model: gemini-model
feature: 001-todo-web-app
branch: main
user: user
command: /sp.implement solve this error ./src/app/tasks/page.tsx
labels: ["bug-fix", "nextjs", "client-component"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/app/tasks/page.tsx
tests:

---

## Prompt

/sp.implement solve this error ./src/app/tasks/page.tsx
Error: 
  × You're importing a component that needs useState. It only works in a Client Component but none of its parents are marked with "use client", so they're Server Components by default.
  │ Learn more: https://nextjs.org/docs/getting-started/react-essentials
  │ 
  │ 
   ╭─[C:\Users\user\Desktop\lastdamn\frontend\src\app\tasks\page.tsx:1:1]
 1 │ import React, { useState, useEffect, useCallback } from "react";
   ·                 ────────
 2 │ import { CreateTaskForm } from "@/components/CreateTaskForm";
 3 │ import { TaskList } from "@/components/TaskList";
 4 │ import { api } from "@/lib/api";
   ╰────

  × You're importing a component that needs useEffect. It only works in a Client Component but none of its parents are marked with "use client", so they're Server Components by default.
  │ Learn more: https://nextjs.org/docs/getting-started/react-essentials
  │ 
  │ 
   ╭─[C:\Users\user\Desktop\lastdamn\frontend\src\app\tasks\page.tsx:1:1]
 1 │ import React, { useState, useEffect, useCallback } from "react";
   ·                           ─────────
 2 │ import { CreateTaskForm } from "@/components/CreateTaskForm";
 3 │ import { TaskList } from "@/components/TaskList";
 4 │ import { api } from "@/lib/api";
   ╰────

## Response snapshot

Added 'use client'; directive to frontend/src/app/tasks/page.tsx to mark it as a Client Component, resolving the error related to useState, useEffect, and useCallback usage.

## Outcome

- ✅ Impact: The frontend/src/app/tasks/page.tsx component now correctly functions as a Client Component, allowing the use of client-side React hooks.
- 🧪 Tests: No new tests were added, as this was a configuration/directive fix for an existing component. The fix should be verified by running the application.
- 📁 Files: frontend/src/app/tasks/page.tsx was modified.
- 🔁 Next prompts: User to confirm the fix or provide further instructions.
- 🧠 Reflection: The fix directly addresses the Next.js App Router's component rendering model.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): None
- Prompt variant (if applicable): None
- Next experiment (smallest change to try): None
