📄 Task 1.2 — Authentication Store (Zustand)
============================================

🎯 Objective
------------

Create a production-ready authentication store using **Zustand** that supports:

*   Anonymous users (session-based browsing)

*   Authenticated users (JWT-based authentication)

*   Cart continuity between anonymous and authenticated sessions

*   Strongly typed roles (ADMIN, CUSTOMER)

*   Safe persistence with hydration handling


📂 File Location
================

```
src/lib/store/auth.ts
```
1️⃣ Type Definitions
====================

UserRole
--------

```shell
export type UserRole = 'ADMIN' | 'CUSTOMER';
```
AuthState Interface
-------------------

```shell
interface AuthState {  user: User | null;  token: string | null;  sessionId: string | null;  isAuthenticated: boolean;  isHydrated: boolean;  setUser: (user: User | null, token: string | null) => void;  setSessionId: (sessionId: string) => void;  logout: () => void;  clearAll: () => void;  setHydrated: (value: boolean) => void;}
```
2️⃣ Functional Requirements
===========================

Anonymous User Behavior
-----------------------

*   On first application load:

   *   If sessionId does not exist → generate a UUID v4

   *   Persist it to localStorage

*   sessionId must:

   *   Persist after logout

   *   Be used for anonymous cart continuity

   *   Be sent in API headers if no JWT exists


Authenticated User Behavior
---------------------------

*   When user logs in:

   *   Store user

   *   Store token

   *   Keep existing sessionId

*   token must take precedence over sessionId for API requests

*   Backend should merge anonymous cart when login occurs


3️⃣ Store Actions
=================

setUser(user, token)
--------------------

*   Store user

*   Store token

*   Set isAuthenticated = true if token exists


setSessionId(sessionId)
-----------------------

*   Save sessionId

*   Persist to storage


logout()
--------

*   Clear:

   *   user

   *   token

*   Keep:

   *   sessionId

*   Set isAuthenticated = false


clearAll()
----------

*   Clear:

   *   user

   *   token

   *   sessionId

*   Used for:

   *   Hard reset

   *   Security cleanup


setHydrated(value)
------------------

*   Set hydration state after persistence load

*   Prevent UI rendering before auth restoration


4️⃣ Persistence Configuration
=============================

Use Zustand persist middleware.

Persist ONLY:
-------------

*   token

*   sessionId


DO NOT persist:
---------------

*   Full user object (avoid stale sensitive data)


Storage Configuration
---------------------

*   Storage key: 'auth-storage'

*   Storage: localStorage


5️⃣ Helper Functions (Must Be Exported)
=======================================

### getToken()

Returns current token or null.

### getSessionId()

Returns current sessionId or null.

### getAuthHeaders()

Logic:

*   If token exists → return:


```shell
{ Authorization: `Bearer ${token}` }
```
*   Else if sessionId exists → return:


```shell
{ 'X-Session-Id': sessionId }
```
### generateSessionId()

*   Must use:


```shell
crypto.randomUUID()
```
*   No custom generators


### initializeSession()

*   If no sessionId exists:

   *   Generate one

   *   Store it

*   Should run once during app bootstrap


6️⃣ Hydration Handling
======================

*   Use isHydrated flag

*   Prevent:

   *   Redirect loops

   *   Auth flicker

   *   Race conditions

*   Ensure no infinite re-renders


7️⃣ Role Handling
=================

Supported roles:

*   ADMIN

*   CUSTOMER


Roles must be strongly typed.

Do NOT use string\[\].

Example:

```shell
user.roles.includes('ADMIN')
```
8️⃣ API Integration Rules
=========================

*   Token takes precedence over sessionId

*   SessionId used only for anonymous browsing

*   Both must integrate with axios client


9️⃣ Test Scenarios
==================

### 1️⃣ Fresh User

*   Load app

*   sessionId auto-generated

*   token = null

*   isAuthenticated = false


### 2️⃣ Login Flow

*   user + token stored

*   isAuthenticated = true

*   sessionId unchanged


### 3️⃣ Reload Page

*   token + sessionId restored

*   isHydrated = true


### 4️⃣ Logout

*   token cleared

*   user cleared

*   sessionId remains


### 5️⃣ clearAll()

*   Everything removed


🔒 Non-Functional Requirements
==============================

*   Fully typed

*   No any

*   No insecure storage logic

*   No hydration mismatch

*   Production-ready


✅ Deliverable
=============

Export:

```shell
export const useAuthStore;
```
The implementation must be production-grade and aligned with the API client logic.