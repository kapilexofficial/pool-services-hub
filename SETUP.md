# 🏊 Pool Services Hub — Setup Guide

## Quick Start (3 Steps)

### Step 1: Clone the Repository

```bash
git clone https://github.com/kapilexofficial/pool-services-hub.git
cd pool-services-hub
npm install
```

### Step 2: Setup Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Run the SQL scripts in the **Database Setup** section below
4. Copy your credentials to `.env.local`

### Step 3: Configure & Run

```bash
cp .env.example .env.local
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) ✨

---

## Database Setup (Supabase)

Copy & paste each SQL block into your Supabase SQL editor:

### 1. User Profiles Table

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  user_type TEXT CHECK (user_type IN ('client', 'professional')),
  rating FLOAT DEFAULT 0,
  reviews_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_user_type ON user_profiles(user_type);
CREATE INDEX idx_user_profiles_city ON user_profiles(city);
```

### 2. Services Table

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price_min DECIMAL(10, 2),
  price_max DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_services_professional_id ON services(professional_id);
CREATE INDEX idx_services_category ON services(category);
```

### 3. Bookings Table

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_professional_id ON bookings(professional_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);
```

### 4. Payments Table

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  stripe_payment_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
```

### 5. Enable Row Level Security (Optional but Recommended)

```sql
-- User Profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON user_profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their bookings"
  ON bookings
  FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM user_profiles WHERE id = client_id OR id = professional_id
  ));

CREATE POLICY "Clients can create bookings"
  ON bookings
  FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM user_profiles WHERE id = client_id AND user_type = 'client'
  ));
```

---

## Environment Variables

Create `.env.local` in project root:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Stripe (get from stripe.com/dashboard)
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here

# API & App
VITE_API_URL=http://localhost:5173
VITE_APP_NAME=Pool Services Hub
```

**How to find your Supabase credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Settings** → **API**
4. Copy `Project URL` → `VITE_SUPABASE_URL`
5. Copy `Anon key` → `VITE_SUPABASE_ANON_KEY`

---

## Using in Lovable

### Option 1: Import from GitHub (Recommended)

1. Go to [lovable.dev](https://lovable.dev)
2. Click **"Create Project"**
3. Choose **"Import from GitHub"**
4. Enter: `https://github.com/kapilexofficial/pool-services-hub`
5. Lovable will auto-detect Vite + React setup
6. Add your `.env` variables in Lovable settings
7. Done! ✨

### Option 2: Manual File Upload

1. Download all files from GitHub
2. Create new project in Lovable
3. Upload `src/` folder
4. Copy `.env.example` → `.env.local` in Lovable
5. Set environment variables

### Option 3: From This Local Copy

Since you've already cloned:
1. Open [lovable.dev](https://lovable.dev)
2. Create new project
3. Open `/tmp/pool-services-hub` in your code editor
4. Copy component files into Lovable
5. Set `.env.local` in Lovable dashboard

---

## What's Included

✅ **6 Core Components:**
- AuthGuard (route protection)
- SignUp (user registration)
- Login (authentication)
- ProfessionalSearch (discovery)
- ProfessionalCard (professional profile)
- BookingForm (appointment scheduling)

✅ **2 Pages:**
- HomePage (landing page)
- DashboardPage (user dashboard)

✅ **Integration Layer:**
- Supabase client & types
- API wrapper functions
- Zustand state management
- React Router routing

✅ **Styling:**
- Responsive CSS
- Purple gradient theme
- Mobile-friendly design

---

## Next Steps

### Today (Friday)
- [x] Project structure
- [x] Core components
- [x] Supabase setup
- [x] GitHub repo

### Tomorrow (Saturday)
- [ ] Stripe payment integration
- [ ] Professional dashboard
- [ ] Booking confirmation page
- [ ] Email notifications

### Monday
- [ ] Professional profile editor
- [ ] Admin dashboard
- [ ] Analytics

---

## File Structure Explained

```
pool-services-hub/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AuthGuard.tsx
│   │   ├── SignUp.tsx
│   │   ├── Login.tsx
│   │   ├── ProfessionalSearch.tsx
│   │   ├── ProfessionalCard.tsx
│   │   ├── BookingForm.tsx
│   │   └── [*.css]          # Component-specific styles
│   │
│   ├── pages/               # Full page components
│   │   ├── HomePage.tsx     # Landing page
│   │   ├── DashboardPage.tsx # User dashboard
│   │   └── [*.css]
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts       # Auth state (Zustand)
│   │   └── useProfessionals.ts # Search state (Zustand)
│   │
│   ├── lib/                 # Utilities & integrations
│   │   ├── supabase.ts      # Supabase client + types
│   │   └── api.ts           # API wrapper functions
│   │
│   ├── App.tsx              # Main app + routing
│   ├── main.tsx             # React entry point
│   ├── index.css            # Global styles
│   └── App.css              # App-level styles
│
├── .env.example             # Environment template
├── package.json             # Dependencies
├── vite.config.js          # Vite configuration
├── README.md               # Full documentation
└── SETUP.md               # This file!
```

---

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- --host localhost --port 3000
```

### Supabase Connection Issues
- Check `.env.local` has correct URL and key
- Ensure Supabase project is running
- Check browser console for CORS errors

### Styling Looks Wrong
- Clear browser cache (Ctrl+Shift+Delete)
- Check all `.css` files are in correct folders
- Verify `src/index.css` is imported in `src/main.tsx`

### Build Fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Support & Questions

- 📖 Read [README.md](./README.md) for full documentation
- 🐛 Check GitHub Issues for known problems
- 💬 Discuss in GitHub Discussions

---

**You're all set! Happy coding! 🚀**
