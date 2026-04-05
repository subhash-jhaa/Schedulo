# Schedulr Authentication Setup Guide

This guide will help you set up the authentication system for Schedulr using Supabase.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js 18+ installed
- Git for version control

## Step 1: Create a Supabase Project

1. Go to [Supabase Console](https://supabase.com/dashboard)
2. Click "New Project"
3. Select or create a new organization
4. Enter a project name (e.g., "Schedulr")
5. Set a database password (save this securely)
6. Select your preferred region
7. Wait for the project to initialize (~2 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project, go to **Settings > API**
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in your project root:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   DATABASE_URL=postgresql://...  # Optional, for Drizzle ORM
   ```

## Step 4: Configure Authentication Methods

### Email/Password Authentication (Default)

This is already enabled. Users can sign up and sign in with their email and password.

### Google OAuth

1. In your Supabase project, go to **Authentication > Providers**
2. Click "Google" to enable it
3. Follow the setup instructions to create OAuth credentials in Google Cloud Console
4. Copy the **Client ID** and **Client Secret** to Supabase
5. Add your application URL to the Authorized redirect URIs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

### Microsoft/Azure OAuth

1. In your Supabase project, go to **Authentication > Providers**
2. Click "Microsoft" to enable it
3. Follow the setup instructions to register your app in Azure AD
4. Copy the **Client ID** and **Client Secret** to Supabase
5. Add your application URL to the Redirect URIs

## Step 5: Set Up Database Schema

Run the database migrations (if using Drizzle ORM):

```bash
npm run db:migrate
```

This creates the `users` table with the following columns:
- `id` - Primary key
- `supabaseId` - Link to Supabase auth user
- `email` - User email
- `name` - User full name
- `username` - Unique username
- `googleAccessToken` - Optional Google calendar token
- `googleRefreshToken` - Optional Google calendar refresh token
- `createdAt` - Registration timestamp

## Step 6: Configure Email Settings (Optional)

1. Go to **Authentication > Email Templates**
2. Customize email templates for:
   - Verification
   - Password reset
   - Magic links
   - Social signup confirmation

## Step 7: Test the Authentication Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the sign-up flow:
   - Go to `http://localhost:3000/register`
   - Enter your details
   - Create an account
   - Verify your email

3. Test the sign-in flow:
   - Go to `http://localhost:3000/login`
   - Sign in with your email and password

4. Test OAuth (if configured):
   - Go to `http://localhost:3000/login`
   - Click "Continue with Google" or "Continue with Microsoft"

## Step 8: Configure Protected Routes

The following routes are protected and require authentication:
- `/dashboard` - User dashboard
- `/availability` - Availability settings
- `/settings` - User settings
- `/account` - Account management
- `/api/*` - All API routes

Middleware automatically redirects unauthenticated users to `/login`.

## Authentication Features

### Sign Up Features
✅ Email/Password registration
✅ Multi-step registration (account → verification → calendar setup)
✅ Password strength indicator
✅ Email verification code
✅ OAuth (Google & Microsoft)
✅ Automatic user profile creation in database

### Sign In Features
✅ Email/Password login
✅ OAuth (Google & Microsoft)
✅ Session management
✅ Automatic redirect to dashboard on success
✅ Error handling with user feedback

### Session Management
✅ Sessions stored in cookies (secure, httpOnly)
✅ Automatic session refresh
✅ Logout functionality
✅ Protected API routes with role-based access

### Security Features
✅ Password hashing (Supabase handles this)
✅ Email verification required for account activation
✅ HTTPS-only cookie transmission
✅ CSRF protection via Supabase
✅ Rate limiting on auth endpoints (Supabase feature)

## Troubleshooting

### "Unauthorized" Error
- Check that your `.env.local` file exists and has correct credentials
- Verify you're not accessing protected routes without authentication
- Clear cookies and try logging in again

### "User not found" Error
- Ensure email verification was completed
- Check if user exists in Supabase dashboard (Settings > Auth > Users)
- Try signing up again

### OAuth Not Working
- Verify redirect URIs are correctly configured in provider settings
- Check that OAuth credentials are correctly entered in Supabase
- Ensure your domain is whitelisted in provider settings

### Email Verification Not Arriving
- Check spam/junk folder
- Verify email is configured in Supabase (Authentication > Email)
- Check Supabase logs for delivery errors

### Database Connection Issues
- Verify DATABASE_URL is correct in `.env.local`
- Run migrations: `npm run db:migrate`
- Check database is running and accessible

## API Endpoints

### User Management

- `GET /api/user` - Get current user profile
  - Requires authentication
  - Returns: User object with all profile fields

- `POST /api/user` - Create/sync user profile
  - Requires authentication
  - Accepts: `fullName`, `email`, `username`
  - Returns: Created/updated user object

- `PATCH /api/user` - Update user profile
  - Requires authentication
  - Accepts: `name`, `username`
  - Returns: Updated user object

## Next Steps

1. **Configure Calendar Integration**: Set up Google Calendar or Outlook sync
2. **Set Up Email Scheduling**: Configure email reminders and notifications
3. **Implement Availability Management**: Allow users to set their availability
4. **Deploy to Production**: Follow deployment guide for production setup

## Support

For issues or questions:
1. Check [Supabase Documentation](https://supabase.com/docs)
2. Review [Next.js Authentication Best Practices](https://nextjs.org/docs/app/building-your-application/authentication)
3. Contact support through Supabase dashboard

## Environment Variables Summary

| Variable | Source | Required |
|----------|--------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project Settings | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Project Settings | Yes |
| `DATABASE_URL` | Database Connection String | No* |

*Required only if using Drizzle ORM for database operations
