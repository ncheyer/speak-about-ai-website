# Event Hub - Event Management System

A complete event management system built with Next.js, featuring user authentication, event creation, and attendee management.

## ✨ Features

- 🔐 **User Authentication** - Secure login/signup with NextAuth.js
- 📅 **Event Management** - Create, edit, and manage events
- 👥 **Attendee Tracking** - Track event registrations
- 📊 **Dashboard** - Overview of all your events and stats
- 🎨 **Beautiful UI** - Built with Tailwind CSS and shadcn/ui
- 💾 **Flexible Storage** - File-based storage with Google Sheets option

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Environment Variables
Copy `.env.example` to `.env.local` and add:
```bash
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 3. Start Development Server
```bash
pnpm dev
```

### 4. Try the Demo
- Visit `/login` to see the login page
- Visit `/signup` to create an account
- Visit `/dashboard` to see the event management interface

## 📱 Pages

- `/login` - User login
- `/signup` - User registration  
- `/dashboard` - Main event dashboard
- `/events/new` - Create new event

## 🗄️ Data Storage

The system automatically uses the best available storage:

### Default: File-Based Storage
- ✅ **Perfect for v0.dev preview**
- ✅ **No setup required**
- ✅ **Includes sample data**
- 📁 Data stored in local JSON files

### Optional: Google Sheets
- 🔗 **Real-time collaboration**
- ☁️ **Cloud storage**
- 📊 **Easy data viewing**
- See `GOOGLE_SHEETS_SETUP.md` for setup

## 🎭 Demo Data

The system comes with sample data:
- **Demo User**: `demo@example.com` / `password123`
- **Sample Events**: AI Conference 2024, ML Workshop
- **Sample Attendees**: Pre-populated registration data

## 🔧 Technical Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth.js
- **UI**: Tailwind CSS + shadcn/ui
- **Storage**: JSON files (with Google Sheets option)
- **Language**: TypeScript

## 🌟 Perfect for v0.dev

This event hub is specifically designed to work great in preview environments:
- No external API dependencies required
- Pre-populated with demo data
- File-based storage works everywhere
- Clean, modern UI that showcases well

## 📝 API Routes

- `POST /api/auth/signup` - Create new user account
- `POST /api/events` - Create new event
- `GET /api/events` - Get user's events

## 🚀 Deployment Ready

The system is ready for production deployment with:
- Environment variable configuration
- Secure authentication
- Optional Google Sheets integration
- Scalable architecture

---

Built with ❤️ for modern event management