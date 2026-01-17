# Environment variables & API keys

This project uses environment variables to configure database access, authentication, and external services.  
**Secrets are never included in the repository.**  
You must provide your own values depending on which features you want to use.

---

## Quick start (local development)

For local development, **no external services are required**.

```bash
cp .env.example .env
docker compose up -d db
docker compose run --rm migrate
docker compose up --build
```

This will:
- start a local PostgreSQL database (Docker)
- apply all database migrations
- start the app at http://localhost:3000
- start MailHog for email testing at http://localhost:8025

You only need to obtain API keys if you want to enable optional integrations (Google login, etc.).

---

## Product functionality

- **Sign-in & roles**: Google OAuth via Better Auth. Separate entry points for sign-in (login), sign-up (customer), and translator sign-up; every flow works with Google OAuth. Translators also have an intent flag so they land with the correct role.
- **Customer workspace**: Create projects with name, source/target language, description, optional deadline (can be cleared), and upload a source file (`.pdf`, `.txt`, `.docx`, `.doc`, max 20 MB). Language options are auto-disabled when no translator in the database supports them. Dashboard cards show active/in-progress/completed/pending-review counts. Users can download source files, track progress (0–100% set by translator), see QA state, approve or reject when in QA, and grab the translated file when available. After completion they can submit reviews for both the translator and the company; reviews are pinned to the project and visible to translators/admins.
- **Translator workspace**: Sees only assigned projects, with client contact dialog, progress slider (warns if set to 100% without an uploaded translation), and controls to push a project into QA or request customer approval when uploading a translation. Uploading a translated file can auto-set progress to 100%, flip status to QA, and notify the customer. Translators see their aggregated ratings (overall + quality/communication/punctuality breakdown) and review distribution.
- **Admin workspace**: Overview tab with user/translator/project stats and recent activity. User management allows role changes (user/translator), deep links to a user’s or translator’s projects, and translator management. Admin project detail view shows client/translator info, files, progress, reviews, and full status control (including force-setting DONE); if a project is marked DONE without customer approval, an alert highlights the exception. Cross-links let admins jump directly to the relevant user or translator profile from a project.

---

## Database & migrations

This project uses **Drizzle ORM migrations**.  
Migrations are required before the application can run correctly.

### Running migrations (required on first start)

```bash
docker compose up -d db
docker compose run --rm migrate
```

This command:
- connects to the database defined by `DATABASE_URL`
- applies all migrations from `db/migrations`
- is safe to run multiple times (already-applied migrations are skipped)

### When do I need to run migrations again?

Run migrations when:
- you pull new changes that include schema updates
- you delete the database volume
- you switch to a new database (`DATABASE_URL` changes)

---

## Rebuilding after dependency changes

If you add, remove, or update npm dependencies:

```bash
rm -rf node_modules
npm ci
docker compose build --no-cache
docker compose up --build
```

---

## Required variables

### DATABASE_URL

A PostgreSQL connection string.

#### Option A – Local database (recommended)

```env
DATABASE_URL=postgresql://app:app@db:5432/app
```

#### Option B – Cloud database (production)

```env
DATABASE_URL=postgresql://user:password@host.region.provider.tech/dbname?sslmode=require
```

---

### BETTER_AUTH_SECRET

A secret key used to sign authentication tokens.

#### Local development
A default development value is provided.

#### Production

```bash
openssl rand -base64 32
```

```env
BETTER_AUTH_SECRET=your_generated_secret
```

⚠️ Never reuse this secret across environments.

---

## Optional integrations

### Google OAuth (Sign in with Google)

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Authorized redirect URI:
```
http://localhost:3000/api/auth/callback/google
```

If these variables are not set, Google login is disabled.

---

## Email configuration (local testing)

```env
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_SECURE=false
MAIL_FROM="Dev <dev@example.test>"
```

MailHog UI:
```
http://localhost:8025
```

---

## Public variables

### NEXT_PUBLIC_APP_URL

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Change this in production to your real domain.

---

## Summary

| Variable | Required | Description |
|---------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| BETTER_AUTH_SECRET | Yes (prod) | Authentication signing secret |
| GOOGLE_CLIENT_ID | Optional | Google OAuth |
| GOOGLE_CLIENT_SECRET | Optional | Google OAuth |
| SMTP_* | No | Local email testing |
| NEXT_PUBLIC_APP_URL | Yes | Public app URL |

---

## Security notes

- Never commit `.env` files  
- Never share secrets publicly  
- Rotate secrets immediately if exposed  
- Use different secrets for development and production
