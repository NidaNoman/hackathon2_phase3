---
id: 45
title: Fix Frontend API Credentials for Authentication
stage: green
date: 2026-01-15
surface: agent
model: gemini
feature: 001-todo-web-app
branch: 
user: 
command: /sp.implement
labels: [frontend, authentication, api, bugfix]
links:
  spec: 
  ticket: 
  adr: 
  pr: 
files:
 - frontend/src/lib/api.ts
tests:

---

## Prompt

INFO:     127.0.0.1:53749 - "GET /api/v1/tasks/ HTTP/1.1" 401 Unauthorized
INFO:     127.0.0.1:53749 - "GET /api/v1/tasks/ HTTP/1.1" 401 Unauthorized

## Response snapshot

I have investigated the `401 Unauthorized` errors for `GET /api/v1/tasks/` that you reported. These errors indicate that the frontend is not sending the necessary authentication credentials with its requests to the backend.

The root cause of this issue is that the `fetch` API, by default, does not send cookies with cross-origin requests. Even though the backend's CORS policy (`allow_credentials=True`) was configured to allow credentials, the frontend was not explicitly instructing `fetch` to include them.

I have fixed this by modifying `frontend/src/lib/api.ts` to include `credentials: 'include'` in the `RequestInit` configuration when making authenticated requests.

Here's the relevant change in `frontend/src/lib/api.ts`:

```typescript
  const config: RequestInit = {
    method,
    headers: requestHeaders, // Use the dynamically created headers
    body: requestBody,
    credentials: authenticated ? 'include' : 'omit', // Include credentials (cookies) for authenticated requests
  };
```

This ensures that the `accessToken` cookie will now be sent with all authenticated requests, allowing the backend to properly authenticate the user and resolve the `401 Unauthorized` errors.

## Outcome

- ✅ Impact: Resolved the `401 Unauthorized` errors for authenticated frontend requests, enabling proper communication between the frontend and backend.
- 🧪 Tests: No new tests were added.
- 📁 Files: 
  - `frontend/src/lib/api.ts`
- 🔁 Next prompts: The frontend should now be able to successfully fetch tasks and interact with other authenticated endpoints.
- 🧠 Reflection: Cross-origin cookie handling with `fetch` is a common pitfall. Explicitly setting `credentials: 'include'` is crucial when `allow_credentials` is enabled on the server side.

## Evaluation notes (flywheel)

- Failure modes observed: The frontend was not sending authentication cookies with cross-origin requests, leading to `401 Unauthorized` errors.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): 
- Next experiment (smallest change to try): 
