# BookIt: Experiences & Slots

A modern fullstack booking platform for travel experiences built with **Next.js 15**, **TypeScript**, **TailwindCSS**, and **Shadcn**.

This project was built as an internship screening assignment for Highway Delite

The backend of the app is hosted at - https://bookit-backend-vke3.onrender.com
Github repo for the frontend - https://github.com/vikram42003/bookit-experiences-and-slots

## Live

- **Live App**: https://bookit-experiences-and-slots.vercel.app/
- **Backend API**: https://bookit-backend-vke3.onrender.com/
- **Backend GitHub Repo**: https://github.com/vikram42003/bookit-backend

## Tech Stack

**Frontend**: Next.js 15 • TypeScript • TailwindCSS 4 • Lucide Icons  
**Deployment**: Vercel (Frontend) • Render (Backend)

## Key Technical Highlights

### Advanced Next.js Features
- **Server-Side Rendering (SSR)**: Experience pages pre-rendered for optimal SEO and performance
- **Incremental Static Regeneration (ISR)**: Smart caching with automatic revalidation
  - Home page: 180s revalidation
  - Experience details: 60s revalidation for real-time availability
- **React Server Components**: Reduced client-side JavaScript, improved load times
- **App Router**: Modern Next.js routing with nested layouts

### Architecture & Performance
- **Type Safety**: End-to-end TypeScript with strict mode
- **Responsive Design**: Pixel-perfect implementation matching Figma design
- **Optimized Images**: Next.js Image component with automatic WebP conversion
- **Component Library**: Tailwind + Shadcn/ui
- **Real-time Updates**: Dynamic time slot availability and booking capacity management (both client side and server side)

### Business Logic
- Search with URL state preservation
- Booking verification with double-booking prevention
- Promo code validation (percentage & flat rate discounts)

## Technical Implementation Highlights

### Server-Side Rendering with ISR
```typescript
// Automatic revalidation every 60 seconds
const res = await fetch(API_URL + "/experiences/" + id, { 
  next: { revalidate: 60 } 
});
```

### Type-Safe API Integration
```typescript
export type ExperienceType = {
  id: string;
  name: string;
  price: number;
  // ... full type safety across the app
};
```

### Smart Environment Configuration
```typescript
// Handles trailing slashes automatically
export const API_URL = rawApiUrl.endsWith("/") 
  ? rawApiUrl.slice(0, -1) 
  : rawApiUrl;
```

## Quick Start

```bash
# Clone the repository
git clone https://github.com/vikram42003/bookit-experiences-and-slots.git
cd bookit-experiences-and-slots

# Install dependencies
npm install

# Set up environment variables
echo "NEXT_PUBLIC_API_URL=backend_api_url" > .env.local

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 

(You can either call my Render backend api (Its cors config allows "*") or go to the [backend repository](https://github.com/vikram42003/bookit-backend), set up the backend and run it with that)

## Project Structure
(only demonstrates all major component/files/directories)

```
app/
├── (root)/page.tsx          # Home - SSR with ISR (180s)
├── experiences/[id]/        # Dynamic routes - SSR with ISR (60s)
├── checkout/                # Client-side booking flow
└── result/                  # Confirmation page

components/
├── ui/                      # Reusable shadcn components
├── ExperienceCards.tsx      # Grid of experiences available for booking
├── ExperienceDetails.tsx    # Detail view with booking logic
└── Navbar.tsx              # Navigation with search

lib/
├── config.ts               # Centralized API configuration
└── utils.ts                # Utility functions

types/types.ts              # TypeScript definitions
```

##  Pages

### 1. **Home Page** (`/`)
Server-rendered experience grid with search functionality and automatic image optimization

### 2. **Experience Details** (`/experiences/[id]`)
Dynamic routing with real-time availability, interactive date/time selection, and live price calculation

### 3. **Checkout** (`/checkout`)
Form validation, promo code application, and itemized order summary

### 4. **Confirmation** (`/result`)
Booking verification with reference ID by calling the server and success/failure handling

## Build & Deploy

```bash
# Production build
npm run build
npm run start

# Lint
npm run lint
```

**Deploy to Vercel**: Push to GitHub, import to Vercel, add `NEXT_PUBLIC_API_URL` environment variable.

## Note

Backend hosted on Render free tier may have 20-30s cold boot on first request. Subsequent requests are fast.