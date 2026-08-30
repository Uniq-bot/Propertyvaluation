# Nepal Property Valuation System 🇳🇵

A modern, production-grade web application for real estate property valuation in Nepal (Bagmati Province). Built with **Next.js 16 (App Router)**, **TypeScript**, **Prisma 7 (PostgreSQL)**, **Tailwind CSS v4**, **jose (Native JWT)**, and **Chart.js**.

---

## 🌟 Key Features

- **Weighted Land Valuation Engine**: Combines government rate (40% weight) and market rate (60% weight) across Bagmati Province districts, municipalities, and wards.
- **Building Cost & Depreciation Approach**: Calculates total civil cost per floor, adds sanitary (10%) and electrical (8%) overheads, and applies straight-line depreciation over the building's useful life.
- **10-Year Inflation Forecasting**: Dynamic financial projection visualization for property values over a 10-year horizon.
- **Distress Sale / Auction Analysis**: Assesses collateral liquid values for bank valuations and auction scenarios (Conservative 60%, Expected 70%, Optimistic 80%).
- **Native Manual Authentication**: Secure, lightweight HTTP-only JWT authentication using `jose` and `bcryptjs` with PostgreSQL database persistence.

---

## 🔑 Required Environment Variables

Create a `.env.local` or `.env` file in the project root (see [.env.example](file:///.env.example) for reference):

```bash
# PostgreSQL Database URL (Neon DB, Supabase, AWS RDS, or local Postgres)
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?sslmode=require"

# Session JWT Secret Key (generate using: `openssl rand -base64 32`)
AUTH_SECRET="your-32-character-random-secret-here"
```

---

## 🛠️ Database Setup & Seeding

1. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```
2. **Push Schema to Database**:
   ```bash
   npx prisma db push
   ```
3. **Seed Database (Admin Account)**:
   ```bash
   npm run db:seed
   ```

### 🔑 Seeded Administrator Account Credentials
- **Email**: `admin@valuation.gov.np`
- **Password**: `admin123`

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
  nepal-valuation
```

---

## 🌐 Deploying to Vercel / Cloud Services

1. Import the repository into [Vercel](https://vercel.com).
2. Configure Environment Variables (`DATABASE_URL`, `AUTH_SECRET`).
3. Set the build command to `npm run build` (Prisma generation is executed automatically via the `postinstall` script).
