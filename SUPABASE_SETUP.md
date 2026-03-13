# Supabase Integration Setup

## Step 1: Get Your Supabase Credentials

1. Go to https://app.supabase.com
2. Open your **POOL SERVICE** project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Public Key** → `VITE_SUPABASE_ANON_KEY`

## Step 2: Update .env File

Create `.env` file in project root (copy from `.env.example`) and add:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...YOUR_ANON_KEY...
VITE_STRIPE_PUBLIC_KEY=pk_test_...YOUR_STRIPE_KEY...
VITE_API_URL=http://localhost:5173
VITE_APP_NAME=Pool Services Hub
```

## Step 3: Initialize Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Paste contents of `schema.sql` (from projects/services-hub/schema.sql)
4. Run the query

This creates all 10 tables:
- users
- professionals
- services
- bookings
- payments
- reviews
- messages
- vetting
- analytics

## Step 4: Enable Row Level Security (RLS)

All tables have RLS enabled by default. Policies are set in `schema.sql`.

**Key policies:**
- Users can read/update their own profiles
- Users can view professionals (public data)
- Professionals can update their own data
- Bookings are private to client/professional

## Step 5: Test Authentication

```bash
npm install
npm run dev
```

Then visit http://localhost:5173 and:
1. Click "Sou Cliente"
2. Sign up with test email/password
3. Should see dashboard with profile

## Step 6: Verify in Supabase Console

After signup, check **Supabase → Authentication → Users** to see your test user.

Check **Database → users** table to see the profile record created.

## Troubleshooting

### Error: "Supabase credentials not configured"
- Make sure `.env` file exists in project root
- Restart dev server after updating `.env`

### Auth shows "Signup failed"
- Check that `users` table exists in Supabase
- Verify RLS policies allow inserts (check schema.sql)

### Can't see user in database after signup
- Go to Supabase → Database → users table
- Check if row was created (might be in auth.users instead)
- Verify profile insert trigger is working

## Next Steps

After auth is working:

1. **Professional Search** - Query `professionals` table with filters
2. **Booking System** - Create/read bookings with status tracking
3. **Payments** - Integrate Stripe Payment Intent flow
4. **Notifications** - Send emails via Supabase Functions

## Useful Links

- Supabase Docs: https://supabase.com/docs
- Next.js + Supabase Guide: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- Stripe Integration: https://supabase.com/docs/guides/integrations/stripe
