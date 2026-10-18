# CSRF & Cookie Authentication

## Cookie model

On successful login/refresh the API sets two **HttpOnly** cookies:

| Cookie | Lifetime | Purpose |
| --- | --- | --- |
| `accessToken` | 15 minutes | Verified on every protected request |
| `refreshToken` | 7 days | Rotated on every refresh; stored in the `token` table |

HttpOnly means frontend JavaScript cannot read the tokens — the browser
simply attaches them. `sameSite=none; secure` is used in production so a
frontend on a different domain (Vercel) can still send them.

## Refresh-token rotation

1. `POST /auth/v1/refresh-token` verifies the JWT **and** checks the
   `token` table: the row must exist, be unexpired, unrevoked, and
   **not yet consumed**.
2. The old row is marked `consumedAt` and a brand-new pair is issued.
3. If a stolen refresh token is replayed, the row is already consumed
   → `401`. Logout marks the row `revokedAt` instead.

## CSRF flow (browser writes)

State-changing requests from cookies need a CSRF token, otherwise a
malicious site could fire writes using the visitor's cookies.

1. The frontend calls `GET /auth/v1/csrf-token` before signup/login.
   The API sets a `csrf-session` cookie (`__Host-csrf-session` in
   production) and returns a token bound to that session.
2. The Axios client keeps the token **in memory** and attaches it as the
   `x-csrf-token` header on POST/PUT/PATCH/DELETE.
3. `CsrfMiddleware` validates the header against the issued cookie on
   every write. GET/HEAD/OPTIONS are exempt.
4. After login, refresh, or logout the cookies rotate, so the frontend
   clears its cached token and fetches a fresh one.

Bearer-token clients (non-browser, `Authorization` header) skip CSRF —
there is no ambient cookie for an attacker to exploit.

## Automatic refresh on the frontend

`src/lib/axios.ts` retries a request once after a `401`:

- concurrent 401s share a **single** refresh call (rotation would reject
  parallel refreshes);
- auth endpoints are excluded to avoid refresh loops;
- if refresh fails, an `auth:expired` event signs the user out.

## Roles

`role` (`USER` | `ADMIN`) is part of the signed JWT **and** read from the
database for the session endpoint. Public signup always creates `USER`;
promote accounts to `ADMIN` directly in the database when needed.
