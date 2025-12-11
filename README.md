# Labour Management System

A comprehensive web application for managing agricultural labour bookings, built with Next.js, React, and TypeScript. This system allows users to book labours for various agricultural tasks and provides an admin dashboard for managing bookings, labours, and viewing statistics.

## 🚀 Features

### Public Features
- **Labour Search**: Search and filter labours by location
- **Booking System**: Create bookings for agricultural tasks
- **Public API**: Access booking deletion via public API endpoint

### Admin Dashboard
- **Authentication**: Secure login system for admin access
- **Dashboard**: Comprehensive statistics and visualizations
  - Total labours, bookings, and assignments
  - Skills distribution charts
  - Experience distribution
  - Location and task analytics
- **Labours Management**: 
  - View all registered labours
  - Search by name, phone, location, or skills
  - View labour statistics
- **Bookings Management**:
  - View all bookings
  - Search bookings by phone or ID
  - Delete bookings with confirmation
  - Booking statistics and analytics

## 📋 Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)
- TypeScript knowledge (helpful but not required)
- Upstash Redis account (free tier available)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd labour
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Set up Upstash Redis**
   - Create a free account at [Upstash](https://upstash.com/)
   - Create a new Redis database
   - Copy your REST URL and REST Token
   - Create a `.env.local` file in the root directory:
     ```env
     UPSTASH_REDIS_REST_URL=your_redis_rest_url_here
     UPSTASH_REDIS_REST_TOKEN=your_redis_rest_token_here
     ```

4. **Run the development server**
```bash
   pnpm dev
   # or
npm run dev
# or
yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
labour/
├── src/
│   ├── app/
│   │   ├── admin/              # Admin dashboard pages
│   │   │   ├── dashboard/     # Statistics dashboard
│   │   │   ├── labours/       # Labours list page
│   │   │   ├── bookings/      # Bookings management
│   │   │   ├── login/         # Admin login
│   │   │   └── layout.tsx     # Admin layout with auth
│   │   ├── api/               # API routes
│   │   │   ├── admin/         # Admin APIs
│   │   │   │   ├── login/     # Login endpoint
│   │   │   │   └── stats/     # Statistics endpoint
│   │   │   ├── book/         # Booking APIs
│   │   │   │   ├── delete/   # Delete booking (admin)
│   │   │   │   └── query/    # Query bookings
│   │   │   ├── labours/      # Labour APIs
│   │   │   │   ├── all/      # Get all labours
│   │   │   │   └── loc/      # Get labours by location
│   │   │   └── public/       # Public APIs
│   │   │       └── booking/  # Public booking deletion
│   │   └── page.tsx          # Home page
│   ├── components/
│   │   ├── admin/            # Admin components
│   │   │   ├── navbar.tsx   # Navigation bar
│   │   │   └── booking-table.tsx
│   │   └── ui/              # shadcn/ui components
│   └── lib/                 # Utilities
│       └── redis.ts        # Redis database utilities
├── public/                  # Static assets
└── package.json
```

## 🔌 API Endpoints

### Public APIs

#### Delete Booking (Public)
**Endpoint**: `DELETE /api/public/booking/delete?id={bookingId}`

**Description**: Public endpoint to delete a booking. Always returns success, even if the booking doesn't exist or an error occurs.

**Method**: `DELETE` or `POST`

**Parameters**:
- `id` (query param for DELETE or body for POST): Booking ID to delete

**Response**:
```json
{
  "success": true,
  "message": "Booking deletion processed"
}
```

**Example**:
```bash
# DELETE method
curl -X DELETE "http://localhost:3000/api/public/booking/delete?id=booking-123"

# POST method
curl -X POST "http://localhost:3000/api/public/booking/delete" \
  -H "Content-Type: application/json" \
  -d '{"id": "booking-123"}'
```

#### Get All Labours
**Endpoint**: `GET /api/labours/all`

**Response**:
```json
{
  "success": true,
  "labours": [...]
}
```

#### Get Labours by Location
**Endpoint**: `POST /api/labours/loc`

**Body**:
```json
{
  "loc": "Mangalore"
}
```

**Response**:
```json
{
  "success": true,
  "count": 60,
  "location": "Mangalore",
  "labours": [...]
}
```

### Admin APIs (Require Authentication)

#### Admin Login
**Endpoint**: `POST /api/admin/login`

**Body**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### Get Statistics
**Endpoint**: `GET /api/admin/stats`

**Response**: Returns comprehensive statistics about labours and bookings.

#### Query Bookings
**Endpoint**: `POST /api/book/query`

**Body** (various modes):
```json
// Get all
{ "mode": "all" }

// By phone
{ "mode": "byPhone", "phone": "9845012345" }

// By ID
{ "mode": "byId", "id": "booking-id" }
```

#### Delete Booking (Admin)
**Endpoint**: `DELETE /api/book/delete?id={bookingId}`

**Description**: Admin endpoint with proper error handling.

## 🔐 Admin Access

**Default Credentials**:
- Username: `admin`
- Password: `admin123`

⚠️ **Important**: Change these credentials in production! Update them in `src/app/api/admin/login/route.ts`.

## 📊 Data Storage

**Bookings**: Stored in Upstash Redis for fast, scalable access. All booking operations use Redis.

**Labours**: Stored in the API route files:
- `src/app/api/labours/all/route.ts`
- `src/app/api/labours/loc/route.ts`

### Redis Setup

The application uses Upstash Redis for booking storage. Make sure to:
1. Set up your Upstash Redis database
2. Add environment variables to `.env.local`:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

The Redis client is configured in `src/lib/redis.ts` and provides helper functions for all booking operations.

## 🎨 Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Database**: Upstash Redis
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner
- **Icons**: Lucide React

## 🚀 Deployment

### Build for Production

```bash
pnpm build
pnpm start
```

### Environment Variables

Required environment variables (create `.env.local`):

```env
# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL=your_redis_rest_url_here
UPSTASH_REDIS_REST_TOKEN=your_redis_rest_token_here
```

For production, also consider adding:
- Authentication secrets
- API keys

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy automatically

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new).

## 📝 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🔧 Configuration

### Admin Credentials
Edit `src/app/api/admin/login/route.ts` to change admin credentials.

### Data Location
Bookings are stored in `data/bookings.json`. Ensure the `data` directory has write permissions.

## 📈 Features Overview

### Dashboard
- Real-time statistics
- Interactive charts (Pie charts, Bar charts)
- Responsive design
- Mobile-friendly interface

### Labours Management
- Complete labour database
- Advanced search functionality
- Skills and location filtering
- Statistics overview

### Bookings Management
- Full CRUD operations
- Search and filter
- Delete with confirmation
- Statistics tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🐛 Troubleshooting

### Bookings not saving?
- Verify your Upstash Redis credentials are correct in `.env.local`
- Check that `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set
- Ensure your Upstash Redis database is active and accessible
- Check browser console and server logs for Redis connection errors

### Admin login not working?
- Verify credentials in `src/app/api/admin/login/route.ts`
- Check browser console for errors
- Ensure localStorage is enabled

### API endpoints returning errors?
- Check server logs
- Verify request format matches documentation
- Ensure all required parameters are provided

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ using Next.js and TypeScript**
