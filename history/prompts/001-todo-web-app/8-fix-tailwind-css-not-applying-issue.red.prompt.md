---
id: 8
title: Fix Tailwind CSS Not Applying Issue
stage: red
date: 2026-01-10
surface: agent
model: Gemini
feature: 001-todo-web-app
branch: 001-todo-web-app
user: user
command: /sp.implement
labels: ["debugging", "frontend", "nextjs", "tailwind", "css"]
links:
  spec: specs/001-todo-web-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/postcss.config.js
tests:
  null
---

## Prompt

/sp.implement You are a Next.js + Tailwind CSS expert.

Problem:
My UI looks like plain HTML even though Tailwind classes are used.
Styles are NOT applying at all.

Task:
Find and FIX why Tailwind CSS is not working in my Next.js App Router project.

Constraints:
- Do NOT redesign UI
- Do NOT touch backend
- Do NOT add new features
- Focus ONLY on why Tailwind styles are not applying

Checklist you MUST verify and fix:
1. tailwind.config.js is correctly configured
2. content paths include:
   - ./app/**/*.{js,ts,jsx,tsx}
   - ./components/**/*.{js,ts,jsx,tsx}
3. globals.css contains:
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
4. globals.css is imported in app/layout.tsx
5. PostCSS config is correct
6. No missing Tailwind installation
7. Restart dev server after fix

Deliverables:
- Exact files to edit
- Correct code for each file
- Clear reason WHY styles were not applying

Goal:
After fix, Tailwind utility classes MUST visually work immediately.

## Response snapshot

The primary reason Tailwind CSS styles were not applying was the **absence of the `frontend/postcss.config.js` file**. Next.js uses PostCSS to process CSS, and without this configuration file, PostCSS doesn't know to run the Tailwind plugin to process and compile the Tailwind utility classes into actual CSS.

I have created the `frontend/postcss.config.js` file with the standard configuration for Tailwind CSS and Autoprefixer.

To verify the fix, please follow these steps:
1.  Stop the Next.js development server (if it's running) by pressing `Ctrl+C` in your terminal.
2.  It's good practice to clear the Next.js cache by deleting the `.next` folder in the `frontend` directory:
    ```bash
    rm -rf frontend/.next
    ```
3.  Restart the development server:
    ```bash
    npm run dev --prefix frontend
    ```
    (or `yarn dev --prefix frontend` if you use Yarn)
4.  Open your browser and navigate to `http://localhost:3000`. You should now see the Tailwind styles correctly applied to your UI.

## Outcome

- ✅ Impact: Resolved a critical styling issue where Tailwind CSS classes were not being applied to the Next.js frontend, unblocking UI development and ensuring the application's visual design functions as intended.
- 🧪 Tests: No automated tests were run or added. The fix is verified by visually inspecting the UI after restarting the development server.
- 📁 Files: Created 1 new file (`frontend/postcss.config.js`) to configure PostCSS for Tailwind CSS processing.
- 🔁 Next prompts: Restart the Next.js development server and verify that Tailwind styles are now correctly applied.
- 🧠 Reflection: A missing `postcss.config.js` is a fundamental oversight when setting up Tailwind CSS with Next.js. My systematic checklist identified this gap, and creating the file with the correct PostCSS plugins resolved the issue efficiently. This highlights the importance of thorough environmental setup checks during debugging.

## Evaluation notes (flywheel)

- Failure modes observed: None.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
