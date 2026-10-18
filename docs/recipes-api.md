# Recipe Endpoints

All endpoints are relative to the API base URL (which already includes `/api`).
Every response uses the same envelope:

```json
{ "code": 200, "status": "success", "message": "...", "data": { } }
```

## Endpoints

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/recipes/v1/get-recipes` | USER | List the caller's own recipes |
| GET | `/recipes/v1/get-recipe/:id` | USER | Read one of the caller's recipes |
| POST | `/recipes/v1/create-recipe` | USER | Create a recipe owned by the caller |
| POST | `/recipes/v1/update-recipe/:id` | USER | Update the caller's own recipe |
| POST | `/recipes/v1/delete-recipe/:id` | USER | Delete the caller's own recipe |
| GET | `/recipes/v1/get-all-recipes` | ADMIN | Every recipe with `ownerName` |

> Note: update and delete intentionally use **POST** in this API. Follow the
> contract instead of assuming PUT/DELETE. IDs are UUID strings.

## Recipe body

```json
{
  "name": "Tomato Pasta",
  "cuisine": "Italian",
  "mealType": ["Lunch", "Dinner"],
  "difficulty": "Easy",
  "cookTimeMinutes": 30,
  "tags": ["Comfort food"],
  "image": "https://example.com/pasta.jpg",
  "ingredients": ["200g pasta", "3 tomatoes"],
  "instructions": ["Boil the pasta", "Make the sauce"]
}
```

Validation lives in `src/schema/recipe-schema.ts` (Zod). The create schema
strips unknown fields; the update schema accepts any subset of the fields.

## Ownership rules

- Every query that touches a single recipe includes
  `eq(recipes.userId, callerId)` in the repository layer, so a user can
  never read, update, or delete another account's recipe — the database
  enforces it, not just the service.
- ADMIN access is checked by `RoleValidatorMiddleware` on
  `get-all-recipes`; ADMIN routes do not expose mutation of user recipes.

## Status codes

| Code | Meaning |
| --- | --- |
| 200 / 201 | Success |
| 400 | Validation failed or duplicate email |
| 401 | Missing/invalid access token |
| 403 | Wrong role or missing/invalid CSRF token |
| 404 | Recipe not found (or not yours) |
| 500 | Unexpected server error |
