# Supabase Configuration for Auth Frontend

This document outlines the Supabase configuration requirements for the authentication frontend.

## Required Supabase Features

### Authentication
- Email/Password authentication
- Email confirmation required before login
- Password reset via email
- JWT tokens for session management
- PKCE flow for enhanced security

### Database Tables
The frontend expects the following user data structure from the backend API:

```sql
-- Users table (managed by Supabase Auth + custom profile)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sign_in_at TIMESTAMP WITH TIME ZONE
);
```

### Environment Variables Required

The following environment variables must be configured:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_SITE_URL=http://localhost:3000
REACT_APP_BACKEND_URL=http://localhost:8000
```

### Supabase Auth Configuration

1. **Email Templates**: Customize email templates for:
   - Email confirmation
   - Password reset
   - Email change confirmation

2. **Auth Settings**:
   - Enable email confirmation
   - Set session timeout to 30 minutes
   - Configure password requirements
   - Set up email rate limiting

3. **URL Configuration**:
   - Site URL: `http://localhost:3000` (development) / actual domain (production)
   - Redirect URLs: 
     - `http://localhost:3000/verify-email`
     - `http://localhost:3000/reset-password`

### Security Settings

1. **Row Level Security (RLS)**: Enable RLS on all tables
2. **Policies**: Create policies for user data access
3. **JWT Settings**: Configure JWT expiration and refresh settings

### Integration Points

The frontend integrates with Supabase in the following ways:

1. **Direct Supabase Client**: For authentication flows (login, signup, logout)
2. **Backend API**: For protected operations and 2FA (communicates with Supabase server-side)
3. **Email Verification**: Handles email verification tokens from Supabase
4. **Session Management**: Uses Supabase sessions with automatic refresh

### Email Redirect Configuration

Configure the following redirect URLs in Supabase:

- Email confirmation: `${SITE_URL}/verify-email`
- Password reset: `${SITE_URL}/reset-password`

### Required Policies

```sql
-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

This configuration ensures seamless integration between the React frontend and Supabase authentication system.
