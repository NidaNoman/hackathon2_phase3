# Speckit Plan: AI Chatbot

**Date**: 2026-01-17
**Constitution**: [Phase 3 Constitution](specs/constitution-phase3.md)

## 1. Summary

This document outlines the architectural plan for integrating an AI-powered chatbot into the existing application, as per the Phase 3 goal. The plan adheres to the principles of a stateless backend, MCP-only access, and reuse of existing security mechanisms.

## 2. Overall Architecture

The architecture will consist of three main parts: the existing frontend, the existing backend, and a new AI Agent service.

-   **Frontend**: The existing Next.js frontend will be updated with a new chat interface for users to interact with the AI chatbot.
-   **Backend**: The existing FastAPI backend will be extended with new endpoints to handle chat-related functionalities. It will remain stateless, with conversation state managed in the database.
-   **AI Agent**: A new service responsible for processing user messages, interacting with the MCP to perform actions, and generating responses.

## 3. Component Responsibilities

### 3.1. Frontend

-   Render the chat interface.
-   Manage the local state of the conversation (e.g., displaying messages).
-   Send user messages to the backend.
-   Receive and display responses from the AI Agent.

### 3.2. Backend (FastAPI)

-   Provide an API endpoint to receive chat messages from the frontend.
-   Authenticate and authorize user requests using existing Phase 2 mechanisms.
-   Forward user messages to the AI Agent.
-   Persist conversation history to the database via the MCP.
-   Stream responses from the AI Agent back to the frontend.

### 3.3. AI Agent

-   Receive and understand user's natural language messages.
-   Decide on the appropriate tool to use from the MCP to fulfill the user's request.
-   Execute tools via the MCP.
-   Generate user-facing responses.
-   Does not have direct access to the database or other infrastructure.

### 3.4. Master Control Plane (MCP)

-   Expose a set of tools (APIs) for the AI Agent to interact with the system (e.g., `create_task`, `list_tasks`).
-   Enforce business logic and access control.
-   Interact with the database to read or modify data.

## 4. Chat Request Lifecycle

1.  **User**: Enters a message in the frontend chat interface and clicks "send".
2.  **Frontend**: Makes a POST request to the backend's `/chat` endpoint with the user's message.
3.  **Backend**:
    -   Authenticates the request.
    -   Forwards the message to the AI Agent service.
4.  **AI Agent**:
    -   Receives the message.
    -   Processes the message to understand intent.
    -   Selects an appropriate tool from the MCP (e.g., `list_tasks`).
    -   Calls the selected MCP tool.
5.  **MCP**:
    -   Executes the tool's logic (e.g., queries the database for tasks).
    -   Returns the result to the AI Agent.
6.  **AI Agent**:
    -   Receives the result from the MCP.
    -   Generates a natural language response for the user.
    -   Sends the response back to the backend.
7.  **Backend**:
    -   Receives the response from the AI agent.
    -   Persists the user message and the agent's response to the database via the MCP.
    -   Streams the response back to the frontend.
8.  **Frontend**: Receives the response and displays it to the user.

## 5. Data Flow: Agent -> MCP -> DB

-   The **AI Agent** needs to perform an action (e.g., create a task).
-   It calls the corresponding tool on the **MCP** (e.g., `mcp.tasks.create(title="...")`).
-   The **MCP** receives the request, validates it, and then executes the necessary database operations (e.g., `INSERT INTO tasks ...`).
-   The AI Agent never directly interacts with the database.

## 6. Frontend Chat Flow

-   The user is presented with a chat widget.
-   The conversation history is loaded from the backend and displayed.
-   The user can type a message and send it.
-   The message appears in the chat history with a "pending" status.
-   Once the response is received from the backend, the "pending" status is removed, and the agent's response is displayed.
-   The conversation scrolls automatically to the latest message.

## 7. Error Handling Strategy

-   **Frontend**:
    -   If the backend API returns an error, display a user-friendly error message in the chat interface (e.g., "Sorry, I'm having trouble connecting. Please try again later.").
    -   Implement retries with exponential backoff for transient network errors.
-   **Backend**:
    -   Catch errors from the AI Agent and MCP.
    -   Log errors for debugging purposes.
    -   Return appropriate HTTP status codes to the frontend (e.g., 500 for internal server errors, 401 for authentication issues).
-   **AI Agent**:
    -   If a tool execution from the MCP fails, the agent should formulate a response to the user indicating the failure (e.g., "I was unable to create your task. Please try again.").
    -   If the agent cannot understand the user's request, it should ask for clarification.
