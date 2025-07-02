# Tchoupitoulas Data Challenge

A sophisticated data analysis application for exploring Hall of Fame entries with beautiful visualizations and interactive dashboards.

## Features

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
   Create a `.env.local` file in the app directory:
   ```env
   DATABASE_URL="postgresql://username:password@hostname:port/database"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**:
   Ensure your PostgreSQL database has the following table:
   ```sql
   CREATE TABLE hall_of_fame_entries (
       id SERIAL PRIMARY KEY,
       participant_number INTEGER UNIQUE NOT NULL,
       name VARCHAR(255) NOT NULL,
       date_str VARCHAR(50) NOT NULL,
       parsed_date TIMESTAMP NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. **Run database migrations** (optional):
   ```bash
   pnpm drizzle-kit push
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
