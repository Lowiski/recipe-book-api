# Recipe Book API

Express + TypeScript + Drizzle ORM backend for the Full-Stack Recipe Book assignment.

## Stack

- **Express 5** with helmet, cors, hpp, cookie-parser
- **TypeScript** with the `@/` import alias
- **Drizzle ORM** + PostgreSQL (Neon in production)
- **JWT** access/refresh tokens stored in HttpOnly cookies
- **csrf-csrf** double-submit cookie protection for browser writes
- **Zod** request validation

## Layered architecture

```text
routes -> middlewares -> controllers -> services -> repositories -> database
```

| Layer | Responsibility |
| --- | --- |
| `src/routes` | Declare endpoints and their middleware chain |
| `src/middlewares` | Auth, CSRF, role checks, schema validation |
| `src/controllers` | Translate HTTP details into service calls |
| `src/services` | Business rules; return `{ code, status, data }` envelopes |
| `src/repositories` | All SQL queries (Drizzle) |
| `src/db` | Schema definitions and the shared connection pool |

## Endpoints

| Method | Path | Access |
| --- | --- | --- |
| GET | `/api/health` | Public |
| GET | `/api/auth/v1/csrf-token` | Public |
| POST | `/api/auth/v1/signup` | Public (CSRF for browsers) |
| POST | `/api/auth/v1/login` | Public (CSRF for browsers) |
| POST | `/api/auth/v1/refresh-token` | Cookie session |
| POST | `/api/auth/v1/logout` | Cookie session |
| GET | `/api/auth/v1/session` | Authenticated |
| GET | `/api/recipes/v1/get-recipes` | USER (own recipes) |
| GET | `/api/recipes/v1/get-recipe/:id` | USER (own recipe) |
| POST | `/api/recipes/v1/create-recipe` | USER (CSRF) |
| POST | `/api/recipes/v1/update-recipe/:id` | USER (own, CSRF) |
| POST | `/api/recipes/v1/delete-recipe/:id` | USER (own, CSRF) |
| GET | `/api/recipes/v1/get-all-recipes` | ADMIN |

## Local development

```bash
npm install
cp .env.example .env   # then fill DATABASE_URL, JWT_SECRET, CSRF_SECRET
npm run db:plan        # generate SQL from src/db/schema.ts
npm run db:migrate     # apply migrations to DATABASE_URL
npm run dev            # http://localhost:7000
```

## Deployment (Render)

1. Push this repository to GitHub.
2. Render → New → Web Service → connect the repository.
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Environment variables:
   - `DATABASE_URL` (Neon pooled connection string)
   - `JWT_SECRET`, `CSRF_SECRET` (long random strings)
   - `FRONTEND_URL` (your Vercel URL, e.g. `https://your-app.vercel.app`)
   - `BACKEND_URL` (your Render URL)
   - `NODE_ENV=production`
6. After the first deploy, run `npm run db:migrate` once from the Render shell
   (or locally against the Neon URL) to create the tables.
