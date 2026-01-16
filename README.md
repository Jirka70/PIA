# Environment variables & API keys

This project uses environment variables to configure database access, authentication, and external services.  
**Secrets are never included in the repository.**  
You must provide your own values depending on which features you want to use.

---

## Quick start (local development)

For local development, **no external services are required**.

```bash
cp .env.example .env
docker compose up --build
```

This will start:
- the app at http://localhost:3000
- a local PostgreSQL database (Docker)
- MailHog for email testing at http://localhost:8025

You only need to obtain API keys if you want to enable optional integrations (Google login, etc.).

---

## Required variables

### DATABASE_URL
**What it is:**  
A connection string to a PostgreSQL database.

#### Option A – Local database (recommended)
The default setup uses a PostgreSQL container defined in `docker-compose.yml`.

You **do not need to change anything**.  
Default value:
```env
DATABASE_URL=postgresql://app:app@db:5432/app
```

#### Option B – Cloud database (production)
If you want to use a managed database (e.g. Neon, Supabase, Railway):

1. Create an account with a PostgreSQL provider  
2. Create a new database  
3. Copy the provided connection string  
4. Paste it into `.env` as `DATABASE_URL`

Example:
```env
DATABASE_URL=postgresql://user:password@host.region.provider.tech/dbname?sslmode=require
```

---

### BETTER_AUTH_SECRET
**What it is:**  
A secret key used to sign authentication tokens.

#### Local development
A default development value is provided and works out of the box.

#### Production
You **must generate a secure random secret**.

Recommended command:
```bash
openssl rand -base64 32
```

Then set:
```env
BETTER_AUTH_SECRET=your_generated_secret
```

⚠️ Never reuse this secret across environments.

---

## Optional integrations

These variables are only required if you want to enable specific features.

---

### Google OAuth (Sign in with Google)

Variables:
```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

**How to obtain them:**

1. Go to Google Cloud Console  
2. Create a new project (or select an existing one)  
3. Enable Google Identity / OAuth  
4. Create OAuth 2.0 credentials  
5. Add an authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. Copy:
   - Client ID → `GOOGLE_CLIENT_ID`
   - Client Secret → `GOOGLE_CLIENT_SECRET`

If these variables are not set, Google login will be disabled.

---

## Email configuration (local testing)

By default, the project uses **MailHog** for local email testing.

Default values:
```env
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_SECURE=false
MAIL_FROM="Dev <dev@example.test>"
```

You can view captured emails at:
```
http://localhost:8025
```

No configuration is required.

---

## Public variables

### NEXT_PUBLIC_APP_URL
Public application URL (exposed to the browser).

Local default:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Change this in production to your real domain.

---

## Summary

| Variable | Required | Description |
|--------|---------|-------------|
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
