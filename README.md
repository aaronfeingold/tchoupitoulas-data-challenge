# Tchoupitoulas Data Challenge

A sophisticated data analysis application for exploring Hall of Fame entries with beautiful visualizations and interactive dashboards.

## Features

- **Authentication System**: OAuth login with Google and GitHub
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

## Environment Variables

The application requires several environment variables for proper configuration:

- **`NEXT_PUBLIC_BASE_URL`**: Base URL for the application, used for metadata and social sharing. Should be set to your domain in production (e.g., `https://yourdomain.com`) and `http://localhost:3000` for development.
- **`DATABASE_URL`**: PostgreSQL connection string
- **`NEXTAUTH_SECRET`**: Secret key for NextAuth.js session encryption
- **`NEXTAUTH_URL`**: Your application URL for NextAuth.js
- **OAuth credentials**: Client IDs and secrets for Google and GitHub authentication

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
   Use the automated setup script:
   ```bash
   node scripts/dev-setup.js
   ```
   
   Or manually copy and configure:
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
   
   # App Configuration
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"  # Base URL for metadata and social sharing
   
   # OAuth Provider Credentials (see setup guide below)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

4. **Set up OAuth providers** (see detailed guide below):
   - Configure Google OAuth in Google Cloud Console
   - Set up GitHub OAuth app in GitHub Settings

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

## Quick Start for Developers

For the fastest setup experience:

```bash
# Clone and setup
git clone <repo> && cd app
pnpm install

# Automated environment setup (generates .env.local with secret)
node scripts/dev-setup.js

# Set up database
pnpm run db:push

# Start development
pnpm dev
```

The `dev-setup.js` script will:
- Copy `env.example` to `.env.local`
- Generate a secure `NEXTAUTH_SECRET`
- Provide next steps for OAuth configuration

## Adding UI Components (shadcn/ui)

This project uses shadcn/ui for the component library. To add new components:

### Install a new component:
```bash
npx shadcn@latest add [component-name]
```

### Example:
```bash
# Form components
npx shadcn@latest add form
```

### See all available components:
```bash
npx shadcn@latest add
```

This will show you a list of all available components you can install.

### Component Configuration
Components are automatically added to `src/components/ui/` with proper TypeScript types and Tailwind styling. The configuration is managed in `components.json`.

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

### Generate NextAuth Secret

Generate a secure secret for NextAuth.js:
```bash
openssl rand -base64 32
```
Add this to your `.env.local` as `NEXTAUTH_SECRET`.

### Developer Quality of Life - Multiple Environment Support

Most OAuth providers allow multiple redirect URIs, making local development easier:

#### Google OAuth - Multiple URIs
- In Google Cloud Console, you can add **multiple** authorized redirect URIs:
  ```
  http://localhost:3000/api/auth/callback/google
  http://localhost:3001/api/auth/callback/google  (if using different port)
  https://yourdomain.com/api/auth/callback/google
  https://staging.yourdomain.com/api/auth/callback/google
  ```

#### GitHub OAuth - Multiple Apps Approach
- **Option 1**: Create separate OAuth apps for each environment:
  - "MyApp - Development" (localhost callback)
  - "MyApp - Staging" (staging domain callback)  
  - "MyApp - Production" (production domain callback)
- **Option 2**: GitHub allows multiple callback URLs in a single app


### Environment-Specific Configuration

Create environment-specific `.env` files:

**`.env.local` (Development)**:
```env
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-dev-google-client-id
GITHUB_CLIENT_ID=your-dev-github-client-id
# Use dev-specific OAuth apps if needed
```

**`.env.staging`**:
```env
NEXTAUTH_URL=https://staging.yourdomain.com
NEXT_PUBLIC_BASE_URL=https://staging.yourdomain.com
GOOGLE_CLIENT_ID=your-staging-google-client-id
GITHUB_CLIENT_ID=your-staging-github-client-id
```

**`.env.production`**:
```env
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=your-prod-google-client-id
GITHUB_CLIENT_ID=your-prod-github-client-id
```

### Development Workarounds

If you can only set one redirect URI per provider:

1. **Use ngrok for local development**:
   ```bash
   # Install ngrok
   npm install -g ngrok
   
   # Start your Next.js app
   pnpm dev
   
   # In another terminal, create tunnel
   ngrok http 3000
   
   # Use the ngrok HTTPS URL as your OAuth redirect URI
   # Example: https://abc123.ngrok.io/api/auth/callback/google
   ```

2. **Use a development subdomain**:
   - Set up `dev.yourdomain.com` pointing to your local IP
   - Use this consistent URL for OAuth callbacks

3. **Environment switching script**:
   ```bash
   # Available scripts
   pnpm run setup:env      # Copy env.example to .env.local
   pnpm run setup:secret   # Generate NEXTAUTH_SECRET
   pnpm run dev:local      # Start with local environment  
   pnpm run dev:tunnel     # Start with ngrok reminder
   ```

### Important Notes

- **Most providers support multiple redirect URIs** - always check first!
- **Keep your secrets secure** - never commit them to version control
- **Use separate OAuth apps per environment** for better security
- **Test each provider** after setup to ensure they work correctly
- **Document your OAuth setup** for team members

## Troubleshooting

### NextAuth JWT Decryption Error

If you encounter a `JWEDecryptionFailed: decryption operation failed` error, this is usually caused by stale session cookies in your browser.

**Quick Fix**:
- Clear your browser cache/cookies for `localhost:3000`
- Or test in an incognito/private browser window

**Why this happens**: The browser has old session cookies encrypted with a different `NEXTAUTH_SECRET` that can't be decrypted with your current secret.

**If the problem persists**:
1. Generate a new `NEXTAUTH_SECRET`: `openssl rand -base64 32`
2. Update your `.env.local` file
3. Restart your development server
4. Clear browser cache again

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
