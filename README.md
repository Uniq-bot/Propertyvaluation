# Nepal Property Valuation System 🇳🇵

A modern, production-grade web application for real estate property valuation in Nepal (Bagmati Province). Built with **Next.js 16 (App Router)**, **TypeScript**, **Prisma 7 (PostgreSQL)**, **NextAuth v5 (Auth.js)**, **Tailwind CSS v4**, and **Chart.js**.

---

## 🌟 Key Features

- **Weighted Land Valuation Engine**: Combines government rate (40% weight) and market rate (60% weight) across Bagmati Province districts, municipalities, and wards.
- **Building Cost & Depreciation Approach**: Calculates total civil cost per floor, adds sanitary (10%) and electrical (8%) overheads, and applies straight-line depreciation over the building's useful life.
- **10-Year Inflation Forecasting**: Dynamic financial projection visualization for property values over a 10-year horizon.
- **Distress Sale / Auction Analysis**: Assesses collateral liquid values for bank valuations and auction scenarios (Conservative 60%, Expected 70%, Optimistic 80%).
- **Authentication**: Secure Google OAuth integration powered by Auth.js (NextAuth v5) and Prisma user record synchronization.

---

## 🔑 Required Environment Variables

Create a `.env.local` or `.env` file in the project root (see [.env.example](file:///.env.example) for reference):

```bash
# PostgreSQL Database URL (Neon DB, Supabase, AWS RDS, or local Postgres)
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?sslmode=require"

# NextAuth v5 Secret Key (generate using: `openssl rand -base64 32`)
AUTH_SECRET="your-32-character-random-secret-here"

# Google OAuth Credentials (Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# App Canonical Base URL
NEXTAUTH_URL="http://localhost:3000"
```

### How to obtain credentials:
1. **Google OAuth Client ID & Secret**:
   - Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
   - Create an **OAuth 2.0 Client ID** (Web application).
   - Add Authorised Redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://your-domain.com/api/auth/callback/google`
2. **Database URL**:
   - Create a PostgreSQL database instance on [Neon](https://neon.tech), [Supabase](https://supabase.com), or AWS RDS and paste the connection string into `DATABASE_URL`.

---

## 🛠️ Database Setup & Migrations

1. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```
2. **Push Schema to Database**:
   ```bash
   npx prisma db push
   ```
   *(Or run migrations using `npx prisma migrate dev --name init`)*

---

## 🚀 Getting Started (Development)

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Code Quality

- **Run Automated Unit Tests**:
  ```bash
  npm test
  ```
- **Run ESLint Checks**:
  ```bash
  npm run lint
  ```

---

## 📦 Production Build & Local Server

1. **Build the production bundle**:
   ```bash
   npm run build
   ```
2. **Start the production server**:
   ```bash
   npm start
   ```

---

## 🐳 Docker Deployment

Build and run using Docker:

```bash
# 1. Build Docker image
docker build -t nepal-valuation .

# 2. Run container on port 3000 with environment variables
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e AUTH_SECRET="your-auth-secret" \
  -e GOOGLE_CLIENT_ID="your-google-client-id" \
  -e GOOGLE_CLIENT_SECRET="your-google-client-secret" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  nepal-valuation
```

---

## 🌐 Deploying to Vercel / Cloud Services

### Vercel Deployment
1. Import the repository into [Vercel](https://vercel.com).
2. Configure Environment Variables (`DATABASE_URL`, `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_URL`).
3. Set the build command to `npm run build` (Prisma generation is executed automatically via the `postinstall` script).
