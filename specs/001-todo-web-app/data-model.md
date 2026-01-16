# Data Model: Phase-2 Todo Web Application

**Date**: 2026-01-10
**Feature**: [Phase-2 Todo Web Application](specs/001-todo-web-app/spec.md)
**Plan**: [Implementation Plan](specs/001-todo-web-app/plan.md)

## Entities

### User

Represents an individual user of the application. This entity stores user authentication credentials and serves as the owner for tasks.

-   **Attributes**:
    -   `id`:
        -   Type: Integer (Primary Key)
        -   Description: Unique identifier for the user.
        -   Constraints: Auto-incrementing.
    -   `username`:
        -   Type: String
        -   Description: Unique username for login.
        -   Constraints: Required, unique, minimum length (e.g., 3 characters), maximum length (e.g., 50 characters).
    -   `password_hash`:
        -   Type: String
        -   Description: Hashed password for secure authentication.
        -   Constraints: Required, non-empty after hashing.
-   **Relationships**:
    -   Has many `Task` instances (one-to-many relationship where `User` is the parent).

### Task

Represents a single todo item belonging to a user.

-   **Attributes**:
    -   `id`:
        -   Type: Integer (Primary Key)
        -   Description: Unique identifier for the task.
        -   Constraints: Auto-incrementing.
    -   `title`:
        -   Type: String
        -   Description: Short, descriptive title of the task.
        -   Constraints: Required, minimum length (e.g., 1 character), maximum length (e.g., 255 characters).
    -   `description`:
        -   Type: String (Optional)
        -   Description: Detailed description of the task.
        -   Constraints: Optional, maximum length (e.g., 1000 characters).
    -   `status`:
        -   Type: String (Enum or similar for predefined values)
        -   Description: Current status of the task.
        -   Constraints: Required, Allowed values: "pending", "completed". Default: "pending".
    -   `owner_id`:
        -   Type: Integer (Foreign Key)
        -   Description: Identifier of the User who owns this task.
        -   Constraints: Required, must reference an existing `User.id`.
-   **Relationships**:
    -   Belongs to one `User` (many-to-one relationship where `Task` is the child).

## Relationships Overview

-   **One-to-Many**: A `User` can have multiple `Task`s. Each `Task` belongs to exactly one `User`.

## Validation Rules (derived from Functional Requirements and Edge Cases)

-   **User Registration**:
    -   Username MUST be unique.
    -   Username MUST meet minimum and maximum length requirements.
    -   Password MUST meet minimum strength requirements (e.g., length, complexity).
-   **Task Creation/Update**:
    -   Task title MUST be provided and meet length requirements.
    -   Task status MUST be one of the allowed values ("pending", "completed").
-   **Authorization**:
    -   All operations on `Task`s MUST be authorized, ensuring `owner_id` matches the authenticated user's ID.
    -   Attempts to access or modify tasks not owned by the authenticated user MUST be rejected.
