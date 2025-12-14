# Maison du Chocolat - Sweet Shop Application

A premium confectionery e-commerce platform built with Next.js, Supabase, and modern web technologies.

## Features

- 🍫 Product catalog with categories (Chocolate, Candy)
- 🛒 Shopping cart functionality
- 👤 User authentication (Login/Register)
- 🔐 Admin dashboard for product management
- 📊 Real-time inventory tracking
- 🎨 Luxury UI with glassmorphism effects
- ⚡ Fast and responsive design

## Tech Stack

- **Framework**: Next.js 15.3.6
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + Supabase Auth
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Supabase account
- npm/yarn/pnpm/bun

**Note**: This project uses `legacy-peer-deps=true` in `.npmrc` to resolve peer dependency conflicts between React 19 and some packages.

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
     - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
     - `JWT_SECRET`: A secure random string for JWT signing

4. Run the development server:
```bash
npm run dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

The application requires the following Supabase tables:

- `users` - User accounts and authentication
- `sweets` - Product catalog
- `purchases` - Purchase transactions

Refer to your database schema files or contact the administrator for the SQL migration scripts.

## Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### Manual Deployment

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click "Add New Project"

3. Import your Git repository

4. **Important**: Vercel will automatically use the `.npmrc` file to handle dependency conflicts

5. Configure environment variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `JWT_SECRET`

6. Deploy! Vercel will automatically build and deploy your application.

### Environment Variables in Vercel

Make sure to add these environment variables in your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
```

## Project Structure

```
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard page
│   │   ├── login/          # Login page
│   │   └── register/       # Register page
│   ├── components/         # React components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility functions and types
├── public/                # Static assets
└── ...config files
```

## Features in Detail

### User Roles

- **Customer**: Can browse and purchase products
- **Admin**: Can manage products (add, edit, delete, restock)

### Admin Features

- Add new products with images
- Edit existing products
- Delete products
- Restock inventory
- View all products in dashboard

### Customer Features

- Browse product catalog
- Filter by category and price
- Search products
- Purchase products with quantity selection
- View real-time stock availability

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.