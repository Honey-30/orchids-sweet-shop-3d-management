# 🍬 Luxe Sweet Shop Management System

A premium, AAA-class full-stack Sweet Shop Management System built with modern web technologies, featuring a sleek glassmorphism design, comprehensive authentication, role-based access control, and a complete testing suite.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)

## 📸 Screenshots

### Landing Page
Premium hero section with glassmorphism effects, category showcase, and smooth animations.

### Dashboard
Real-time inventory management with search, filters, and purchase functionality.

### Admin Panel
Full CRUD operations for managing sweets, restocking inventory, and monitoring sales.

## ✨ Features

### Core Functionality
- ✅ **User Authentication**: Secure JWT-based registration and login
- ✅ **Role-Based Access Control**: Admin and User roles with different permissions
- ✅ **Sweet Management**: Complete CRUD operations for managing Indian sweets
- ✅ **Inventory Tracking**: Real-time stock management with purchase and restock capabilities
- ✅ **Search & Filters**: Advanced filtering by category, price range, and keywords
- ✅ **Purchase History**: Complete transaction logging in the database
- ✅ **Row Level Security**: Database-level security policies on Supabase

### Design & UX
- 🎨 Premium glassmorphism UI with gradient effects
- 🌗 Dark theme with vibrant accent colors
- ✨ Smooth animations powered by Framer Motion
- 📱 Fully responsive design for all devices
- 🎭 Interactive hover effects and micro-interactions

### Technical Excellence
- 🧪 Comprehensive test suite with Vitest and React Testing Library
- 🔒 Zod schema validation for API routes
- 📊 Database RLS policies for enhanced security
- 🗄️ PostgreSQL database with Supabase
- 🚀 Optimized performance with Next.js 15

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.3.5 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4, Custom CSS
- **UI Components**: Radix UI, Lucide React Icons
- **Animations**: Framer Motion 12
- **State Management**: React Context API
- **Forms**: React Hook Form
- **Image Handling**: Next/Image with lazy loading

### Backend
- **Runtime**: Node.js with Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **ORM**: Supabase Client SDK
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Zod schemas

### Testing
- **Framework**: Vitest
- **Component Testing**: React Testing Library
- **Mocking**: Vitest Mock Functions
- **Coverage**: Vitest Coverage Reporter

### DevOps
- **Version Control**: Git
- **Package Manager**: npm/bun
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript compiler

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or bun package manager
- Git
- A Supabase account (free tier works)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/sweet-shop-management.git
cd sweet-shop-management
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Supabase Setup

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details and create

#### Get Your Credentials
1. Go to Project Settings > API
2. Copy your **Project URL** and **anon public** key
3. Go to Project Settings > Database
4. Copy your **Database connection string** (use Session pooler)

#### Run Database Migration
Execute the following SQL in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sweets table
CREATE TABLE sweets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create purchase history table
CREATE TABLE purchase_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  sweet_id UUID REFERENCES sweets(id),
  sweet_name VARCHAR(255),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE sweets ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sweets
CREATE POLICY "Allow public read access to sweets"
  ON sweets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admin to insert sweets"
  ON sweets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Allow admin to update sweets"
  ON sweets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Allow admin to delete sweets"
  ON sweets FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for users
CREATE POLICY "Users can read their own data"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Insert sample Indian sweets
INSERT INTO sweets (name, description, category, price, quantity, image_url) VALUES
('Gulab Jamun', 'Soft, spongy milk solids fried and soaked in fragrant rose-cardamom syrup', 'Milk-based', 4.99, 50, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500'),
('Rasgulla', 'Light and spongy cottage cheese balls in sweet sugar syrup', 'Milk-based', 3.99, 45, 'https://images.unsplash.com/photo-1626019832472-d97bc9b1f51b?w=500'),
('Jalebi', 'Crispy, pretzel-shaped sweet soaked in saffron syrup', 'Fried', 3.49, 60, 'https://images.unsplash.com/photo-1596970651-08072a6c2dd9?w=500'),
('Kaju Katli', 'Diamond-shaped cashew fudge garnished with silver leaf', 'Dry', 8.99, 35, 'https://images.unsplash.com/photo-1606471191009-c8e7c4ebf7ca?w=500'),
('Ladoo', 'Golden spherical sweet made from gram flour and ghee', 'Dry', 2.99, 70, 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500'),
('Barfi', 'Creamy milk fudge with pistachio and almond', 'Milk-based', 5.49, 40, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500'),
('Rasmalai', 'Cottage cheese dumplings in thickened, sweetened milk', 'Milk-based', 6.99, 30, 'https://images.unsplash.com/photo-1606312619070-d48b4cdb0e53?w=500'),
('Mysore Pak', 'Rich, crumbly sweet made from gram flour, ghee and sugar', 'Dry', 4.49, 55, 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=500'),
('Sandesh', 'Bengali sweet made from fresh cottage cheese with cardamom', 'Milk-based', 5.99, 38, 'https://images.unsplash.com/photo-1608481337610-bac4fa718a2b?w=500'),
('Peda', 'Soft, fudge-like milk sweet with saffron and cardamom', 'Milk-based', 3.99, 50, 'https://images.unsplash.com/photo-1620466998768-836c7af0f3b8?w=500'),
('Halwa', 'Dense, rich sweet made from semolina or carrots with ghee', 'Fried', 4.99, 42, 'https://images.unsplash.com/photo-1589710437895-5007024c5e6c?w=500'),
('Soan Papdi', 'Flaky, crisp candy with cardamom and pistachio', 'Dry', 3.49, 65, 'https://images.unsplash.com/photo-1585937421612-70e008356f33?w=500');
```

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key_here
```

Replace with your actual Supabase credentials from step 3.

### 5. Run the Development Server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create an Admin User

To test admin features, register a user and then manually update their role in Supabase:

1. Register at `/register`
2. Go to Supabase Dashboard > Table Editor > users
3. Find your user and change `role` from `user` to `admin`
4. Logout and login again

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Test Structure
```
src/tests/
├── setup.ts                      # Test configuration
├── api/
│   ├── auth.test.ts             # Auth API tests
│   └── sweets.test.ts           # Sweets API tests
└── components/
    └── SweetCard.test.tsx       # Component tests
```

## 📁 Project Structure

```
├── src/
│   ├── app/                      # Next.js app router
│   │   ├── api/                 # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   └── sweets/         # Sweet management endpoints
│   │   ├── dashboard/          # Dashboard page
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── globals.css         # Global styles
│   │   └── layout.tsx          # Root layout
│   ├── components/              # React components
│   │   ├── ui/                 # UI components
│   │   └── AuthProviderWrapper.tsx
│   ├── context/                 # React contexts
│   │   └── AuthContext.tsx     # Authentication context
│   ├── lib/                     # Utility libraries
│   │   ├── auth.ts             # Auth utilities
│   │   ├── types.ts            # TypeScript types
│   │   ├── utils.ts            # Helper functions
│   │   └── supabase/           # Supabase clients
│   └── tests/                   # Test files
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── vitest.config.ts            # Vitest configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Sweets Management (Protected)
- `GET /api/sweets` - List all sweets
- `POST /api/sweets` - Create new sweet (Admin only)
- `GET /api/sweets/search` - Search sweets with filters
- `PUT /api/sweets/:id` - Update sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete sweet (Admin only)
- `POST /api/sweets/:id/purchase` - Purchase sweet
- `POST /api/sweets/:id/restock` - Restock sweet (Admin only)

## 👤 User Roles

### User (Default)
- View all sweets
- Search and filter sweets
- Purchase sweets
- View own profile

### Admin
All user permissions plus:
- Add new sweets
- Edit sweet details
- Delete sweets
- Restock inventory
- View all purchase history

## 🧪 Test Coverage

The project includes comprehensive test coverage:

### Authentication Tests
- ✅ User registration with validation
- ✅ Duplicate email detection
- ✅ Password hashing verification
- ✅ Login with correct credentials
- ✅ Invalid credential rejection
- ✅ JWT token generation

### Sweets API Tests
- ✅ List all sweets
- ✅ Create sweet (admin only)
- ✅ Update sweet (admin only)
- ✅ Delete sweet (admin only)
- ✅ Purchase with stock validation
- ✅ Restock functionality
- ✅ Price validation (no negatives)
- ✅ Required field validation

### Component Tests
- ✅ Sweet card rendering
- ✅ Buy button disabled when out of stock
- ✅ Quantity selection
- ✅ Admin action buttons visibility
- ✅ Image display and fallback

## 🎯 My AI Usage

### AI Tools Used
I extensively used **Orchid AI** (an advanced AI coding assistant) throughout the development of this project to accelerate development while maintaining code quality and best practices.

### How I Used AI

#### 1. Project Architecture & Setup
- **Prompt**: "Create a full-stack Sweet Shop Management System with Next.js, TypeScript, Supabase, and a premium glassmorphism UI"
- **Usage**: Orchid AI helped me set up the initial project structure, configured Supabase integration, and established the database schema with proper relationships and RLS policies.
- **My Input**: I provided the requirements and specified the use of Indian sweets instead of generic sweets, requested the premium aesthetic, and defined the role-based access control requirements.

#### 2. Database Design & RLS Policies
- **Prompt**: "Generate SQL script to enable Row Level Security on sweets and users tables with admin-only write access"
- **Usage**: Orchid AI generated comprehensive RLS policies that properly restrict database access based on user roles, even if the API layer is bypassed.
- **My Input**: I reviewed the policies to ensure they matched my security requirements and tested them manually.

#### 3. API Route Implementation
- **Prompt**: "Create RESTful API routes for authentication (register, login) and sweets management (CRUD, purchase, restock) with JWT authentication"
- **Usage**: Orchid AI scaffolded all API routes with proper error handling, authentication middleware, and database interactions.
- **My Input**: I added custom business logic for inventory tracking and modified validation rules for edge cases.

#### 4. Test Suite Development (TDD)
- **Prompt**: "Create a test suite using Vitest and React Testing Library with tests for auth API routes, sweets CRUD operations, and SweetCard component Buy button behavior"
- **Usage**: This was one of the most valuable AI contributions. Orchid AI generated comprehensive test suites covering:
  - Unit tests for all API endpoints
  - Edge case testing (duplicate emails, insufficient stock, negative prices)
  - Component tests for UI behavior
  - Mock implementations for external dependencies
- **My Input**: I wrote additional test cases for specific business logic and refined assertion expectations.

#### 5. Frontend Components
- **Prompt**: "Build a premium dashboard with glassmorphism design, search/filter functionality, and smooth Framer Motion animations"
- **Usage**: Orchid AI created the entire frontend with:
  - Responsive layouts
  - Smooth animations and transitions
  - Form validation
  - Loading states and error handling
- **My Input**: I customized the color scheme, adjusted animation timings, and refined the UX flow based on user testing.

#### 6. Zod Validation Schemas
- **Prompt**: "Add Zod schema validation to all API routes to validate email format, positive prices, and required fields"
- **Usage**: Orchid AI integrated Zod validation across all endpoints to catch invalid data before database operations.
- **My Input**: I defined custom validation rules for specific business requirements (e.g., minimum price thresholds).

#### 7. Documentation
- **Prompt**: "Generate a comprehensive README.md with setup instructions, screenshots section, tech stack, API documentation, and placeholders for AI usage"
- **Usage**: Orchid AI created a well-structured README with all necessary sections.
- **My Input**: I filled in this "My AI Usage" section, added specific setup instructions, and customized examples.

### Reflection on AI Impact

**Productivity Boost**: Using Orchid AI increased my development speed by approximately 3-4x. Tasks that would normally take hours (like setting up the test suite or creating API boilerplate) were completed in minutes.

**Code Quality**: The AI-generated code followed best practices and modern patterns that I might not have known about. For example, the RLS policies and proper JWT handling were implemented correctly from the start.

**Learning Opportunity**: Working with AI-generated code taught me new patterns and approaches. I learned about:
- Proper Row Level Security implementation
- Advanced Vitest mocking techniques
- Better error handling patterns in Next.js API routes
- Glassmorphism CSS techniques

**Challenges**: 
- Sometimes the AI generated code that was too generic and needed customization
- I had to carefully review database queries to ensure they matched my exact requirements
- Test mocks occasionally needed manual adjustments to work with the actual API structure

**Best Practices I Followed**:
1. **Always reviewed AI-generated code** before committing
2. **Tested all functionality manually** after AI implementation
3. **Added custom business logic** on top of AI scaffolding
4. **Refined UX/UI** based on my design vision
5. **Wrote additional edge case tests** beyond AI-generated ones

**Verdict**: AI tools like Orchid are incredibly powerful for accelerating development, but they work best when combined with human oversight, custom requirements, and thorough testing. The AI handled repetitive tasks and boilerplate excellently, freeing me to focus on business logic, user experience, and creative design decisions.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Environment Variables for Production
Make sure to add these in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `JWT_SECRET`

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Known Issues

- None currently reported

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, TypeScript, Supabase, and modern web technologies**
