# Tchoupitoulas Data Challenge

A sophisticated data analysis application for exploring Hall of Fame entries with beautiful visualizations and interactive dashboards.

## Features

- **Authentication System**: OAuth login with Google, GitHub, and Facebook
- **User Profiles**: Custom ice cream themed avatars and profile management
- **Data Explorer**: Browse through all Hall of Fame entries with powerful filtering and search
- **Interactive Charts**: Yearly totals (bar chart) and monthly trends (line chart)
- **Analytics Dashboard**: Comprehensive insights including:
  - Total entries and unique participants
  - Longest streaks and gaps analysis
  - Most common names and participation patterns
  - Date range analysis
- **Modern UI**: Beautiful, responsive design with glass morphism effects
- **Fun Theme**: Ice cream shop inspired design with mint and pink color palette

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM (NeonDB)
- **Authentication**: NextAuth.js with OAuth providers
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Prerequisites

- Node.js 22+
- pnpm
- PostgreSQL database (NeonDB recommended)

## Installation

1. **Clone the repository and navigate to the app directory**:
   ```bash
   cd app
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   Copy the example environment file and configure:
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@hostname:port/database"
   
   # NextAuth.js Configuration
   NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32
   NEXTAUTH_URL="http://localhost:3000"
   
   # OAuth Provider Credentials (see setup guide below)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   FACEBOOK_CLIENT_ID="your-facebook-client-id"
   FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
   ```

4. **Set up OAuth providers** (see detailed guide below):
   - Configure Google OAuth in Google Cloud Console
   - Set up GitHub OAuth app in GitHub Settings
   - Create Facebook app in Facebook Developers

5. **Set up the database**:
   Run database migrations to create all required tables:
   ```bash
   pnpm run db:generate
   pnpm run db:push
   ```

## Running the Application

1. **Development mode**:
   ```bash
   pnpm dev
   ```

2. **Production build**:
   ```bash
   pnpm build
   pnpm start
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## OAuth Provider Setup Guide

To enable authentication, you need to configure OAuth applications with each provider:

### Google OAuth Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select an existing one
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Choose "Web application" as application type
   - Add authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://yourdomain.com/api/auth/callback/google`
5. **Copy the Client ID and Client Secret** to your `.env.local` file

### GitHub OAuth Setup

1. **Go to GitHub Settings**: https://github.com/settings/developers
2. **Click "New OAuth App"**
3. **Fill in the application details**:
   - Application name: "Tchoupitoulas Data Challenge"
   - Homepage URL: `http://localhost:3000` (or your domain)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. **Register the application**
5. **Copy the Client ID and generate a Client Secret**
6. **Add them to your `.env.local` file**

### Facebook OAuth Setup

1. **Go to Facebook Developers**: https://developers.facebook.com/
2. **Create a new app** > "Consumer" type
3. **Add Facebook Login product**:
   - Go to "Products" > "Facebook Login" > "Settings"
   - Add Valid OAuth Redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/facebook`
     - Production: `https://yourdomain.com/api/auth/callback/facebook`
4. **Get your credentials**:
   - Go to "Settings" > "Basic"
   - Copy App ID and App Secret
5. **Add them to your `.env.local` file**

### Generate NextAuth Secret

Generate a secure secret for NextAuth.js:
```bash
openssl rand -base64 32
```
Add this to your `.env.local` as `NEXTAUTH_SECRET`.

### Important Notes

- **Redirect URIs must match exactly** - including protocol (http/https)
- **For production**, update all redirect URIs to use your production domain
- **Keep your secrets secure** - never commit them to version control
- **Test each provider** after setup to ensure they work correctly

## Dashboard Features

### Overview Tab
- Key statistics cards (total entries, unique names, longest streak, longest gap)
- Date range information
- Top 10 most common names with rankings

### Data Table Tab
- Complete dataset display
- Real-time search functionality
- Sortable columns
- Pagination with customizable page sizes

### Analytics Tab
- **Yearly Totals**: Bar chart showing entries by calendar year
- **Monthly Trends**: Line chart displaying month-by-month patterns
- Additional analytics planned for future releases

## Design System

- **Primary Colors**: White background with mint green accents
- **Secondary Colors**: Subtle pink highlights
- **Typography**: Poppins font family
- **Effects**: Glass morphism, hover animations, gradient backgrounds
- **Mobile-first**: Responsive design for all device sizes

## Database Schema

The application expects a `hall_of_fame_entries` table with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Unique identifier |
| `participant_number` | INTEGER UNIQUE | Participant number |
| `name` | VARCHAR(255) | Participant name |
| `date_str` | VARCHAR(50) | Original date string |
| `parsed_date` | TIMESTAMP | Parsed date for analysis |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Record update time |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Next.js team for the amazing framework
- shadcn/ui for the beautiful component library
- Recharts for the charting capabilities
- The ice cream shops of New Orleans for inspiration!
