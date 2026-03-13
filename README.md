# 🏊 Pool Services Hub MVP

A two-sided marketplace for pool service providers and clients. Built with React, Supabase, and Stripe.

## 🎯 Overview

**Pool Services Hub** connects:
- **Clients** — Looking for pool cleaning, maintenance, and repair services
- **Professionals** — Offering pool services with ratings and availability

### Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Supabase (PostgreSQL + REST API)
- **Authentication:** Supabase Auth
- **Payments:** Stripe
- **State Management:** Zustand
- **Routing:** React Router

---

## 📋 Project Structure

```
pool-services-hub/
├── src/
│   ├── components/
│   │   ├── AuthGuard.tsx          # Route protection
│   │   ├── SignUp.tsx             # User registration
│   │   ├── Login.tsx              # User login
│   │   ├── ProfessionalSearch.tsx # Search & filter professionals
│   │   ├── ProfessionalCard.tsx   # Professional profile card
│   │   ├── BookingForm.tsx        # Booking interface
│   │   └── [*.css]                # Component styles
│   ├── pages/
│   │   ├── HomePage.tsx           # Landing page
│   │   ├── DashboardPage.tsx      # User dashboard
│   │   └── [*.css]
│   ├── hooks/
│   │   ├── useAuth.ts             # Auth state management
│   │   └── useProfessionals.ts    # Professional search state
│   ├── lib/
│   │   ├── supabase.ts            # Supabase setup & types
│   │   └── api.ts                 # API wrapper functions
│   ├── types/
│   ├── App.tsx                    # Main app + routing
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── .env.example                   # Environment variables template
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account
- Stripe account

### 1. Clone & Install

```bash
git clone <repo-url>
cd pool-services-hub
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env.local
```

Then fill in your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here
VITE_API_URL=http://localhost:5173
VITE_APP_NAME=Pool Services Hub
```

### 3. Setup Supabase Database

Create the following tables in your Supabase project:

#### `user_profiles`
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
```

#### `services`
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
```

#### `bookings`
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
```

#### `payments`
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
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📱 Core Components

### Authentication
- **SignUp** — Register as client or professional
- **Login** — Secure login with email/password
- **AuthGuard** — Protected routes

### Discovery (Clients)
- **ProfessionalSearch** — Search by service, location, rating
- **ProfessionalCard** — View professional details, rating, services
- **BookingForm** — Schedule appointments

### Dashboard
- **Client Dashboard** — View bookings, search services
- **Professional Dashboard** — View requests, manage profile, earnings

---

## 🔌 API Integration

All API calls are wrapped in `src/lib/api.ts`:

```typescript
// Authentication
await authAPI.signUp(email, password, userData)
await authAPI.login(email, password)
await authAPI.logout()

// Professionals
await professionalAPI.searchProfessionals(filters)
await professionalAPI.getProfessional(id)

// Bookings
await bookingAPI.createBooking(booking)
await bookingAPI.updateBookingStatus(bookingId, status)

// Payments
await paymentAPI.createPayment(payment)
```

---

## 🎨 Customization

### Styling
- Global styles: `src/index.css`
- Component styles: `.css` files per component
- Color scheme: CSS variables in `:root`

### State Management (Zustand)
- `useAuth` — Authentication state
- `useProfessionals` — Professional search state

---

## 📦 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key |
| `VITE_API_URL` | API base URL |
| `VITE_APP_NAME` | Application name |

---

## 🔐 Security

- ✅ Supabase Auth for secure authentication
- ✅ Row Level Security (RLS) ready for Supabase
- ✅ Protected routes with AuthGuard
- ✅ Environment variables for sensitive data
- ⚠️ TODO: Stripe webhook integration for payment verification

---

## 📅 Roadmap

### Phase 1 (✅ Done)
- [x] Project setup & structure
- [x] Core components (Auth, Search, Booking, Card)
- [x] Supabase integration
- [x] Zustand state management
- [x] Responsive UI

### Phase 2 (🔄 In Progress)
- [ ] Stripe payment integration
- [ ] Real-time notifications (Supabase realtime)
- [ ] Professional dashboard & profile editor
- [ ] Booking history & reviews
- [ ] Email notifications

### Phase 3 (📅 Planned)
- [ ] Admin dashboard
- [ ] Analytics & reporting
- [ ] Mobile app (React Native)
- [ ] Maps integration
- [ ] SMS notifications

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Testing
Setup for Jest/Vitest coming soon.

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

```bash
vercel deploy
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

---

## 📞 Support

For issues or questions:
1. Check existing GitHub issues
2. Open a new issue with details
3. Join our Discord community (coming soon)

---

## 📄 License

MIT License — Feel free to use for commercial projects.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Notes

- Components are functional and ready for Supabase integration
- Mock data is used initially; replace with real API calls
- Styling follows a consistent design system (purple gradient theme)
- All TypeScript types are in `src/lib/supabase.ts`

---

**Made with ❤️ for pool service professionals and clients worldwide.**
