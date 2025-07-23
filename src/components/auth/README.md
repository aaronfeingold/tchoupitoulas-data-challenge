## Authentication System Design

### Overview

The authentication system is built around NextAuth.js with OAuth providers, providing a seamless and secure login experience. The system handles both signup and signin through the same OAuth flow, automatically creating user accounts on first login.

### System Architecture

**Core Components:**

- **NextAuth.js Core**: Handles OAuth flows, session management, and security
- **Drizzle Database Adapter**: Persists user data, sessions, and account linkages in PostgreSQL
- **OAuth Providers**: Google and GitHub for external authentication
- **Custom UI Components**: Sign-in buttons, user avatars, and protected route wrappers
- **Session Provider**: React context for accessing authentication state throughout the app

### Sign-Up & Sign-In Flow

**User Initiation:**

1. User clicks "Sign In" button in navbar or encounters protected content
2. Navigation redirects to dedicated `/sign-in` page displaying provider options
3. User selects preferred OAuth provider (Google or GitHub)

**OAuth Authentication:**

1. Browser redirects to external OAuth provider (google.com or github.com)
2. User authenticates with their existing provider account
3. Provider redirects back to application callback URL with authorization code
4. NextAuth.js exchanges authorization code for access token and user profile data

**Account Creation & Linking:**

1. **First-time users**: System automatically creates new user record in database
2. **Returning users**: System links to existing account using provider email/ID
3. User profile data (name, email, avatar) is synced from OAuth provider
4. Session is created and encrypted JWT token is issued

**Session Establishment:**

1. Encrypted session token is stored in secure HTTP-only cookies
2. User is redirected to intended destination (usually `/dashboard`)
3. Session context becomes available throughout the application
4. Authentication state persists across browser sessions until expiration

### Session Management

**Session Lifecycle:**

- **Creation**: Generated after successful OAuth authentication
- **Persistence**: Stored in database with expiration timestamps
- **Refresh**: Automatically renewed on user activity
- **Security**: Encrypted with `NEXTAUTH_SECRET` for tamper protection

**Client-Side Access:**

- React components use `useSession()` hook to access current authentication state
- Session data includes user ID, name, email, and profile image
- Loading states are handled automatically during session initialization
- Real-time updates when authentication state changes

### Sign-Out Flow

**User-Initiated Logout:**

1. User clicks sign-out button in dropdown menu or protected component
2. System clears all session data from database
3. Browser cookies are invalidated and removed
4. User is redirected to home page with public access only

**Automatic Logout:**

- Sessions expire automatically based on configured timeouts
- Invalid or tampered session tokens are rejected
- Security violations trigger immediate session termination

### Callback System

**OAuth Callback Handling:**

- Each provider has dedicated callback URL: `/api/auth/callback/[provider]`
- NextAuth.js automatically handles all callback processing
- Error states are managed and redirected to appropriate error pages
- Success callbacks redirect to intended destination or default dashboard

**Custom Callback Configuration:**

- Sign-in success redirects to `/dashboard` by default
- Sign-out redirects to home page
- Error handling redirects to custom error pages
- Callback URLs are configurable per provider and environment

### Database Integration

**Drizzle ORM Adapter:**

- Seamless integration between NextAuth.js and PostgreSQL database
- Automatic table management for users, accounts, sessions, and verification tokens
- Support for multiple OAuth accounts per user
- Optimized queries for session validation and user lookups

**Data Relationships:**

- **Users Table**: Core user profiles and metadata
- **Accounts Table**: OAuth provider account linkages
- **Sessions Table**: Active user sessions with expiration tracking
- **Verification Tokens**: Email verification and password reset tokens

### Protected Routes & Components

**Access Control:**

- Route-level protection using NextAuth.js middleware
- Component-level protection with custom `ProtectedRoute` wrapper
- Graceful fallbacks for unauthenticated users
- Conditional rendering based on authentication state

**User Experience:**

- Seamless redirects to sign-in page for protected content
- Preserved destination URLs for post-authentication redirects
- Loading states during authentication checks
- Clear visual indicators for authentication requirements

### Security Features

**Session Security:**

- JWT tokens encrypted with rotating secrets
- HTTP-only cookies prevent XSS attacks
- Secure cookie flags for HTTPS environments
- Automatic session invalidation on security violations

**OAuth Security:**

- CSRF protection through state parameters
- Secure redirect URI validation
- Provider-specific security configurations
- Environment-specific callback URL management

### Development & Testing

**Local Development:**

- Hot-reload compatibility with session management
- Clear error messages for configuration issues
- Development-specific OAuth app configurations
- Automatic secret generation for quick setup

**Production Considerations:**

- Environment-specific OAuth configurations
- Secure secret management
- Session persistence across deployments
- Database connection pooling for scale

This architecture provides a robust, scalable authentication system that handles the complexity of OAuth flows while maintaining a simple developer experience and excellent user experience.
