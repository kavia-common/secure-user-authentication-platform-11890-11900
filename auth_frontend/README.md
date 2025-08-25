# Authentication Frontend - React Application

A complete React authentication frontend with TailwindCSS and shadcn/ui components, featuring comprehensive user authentication flows, 2FA, and a protected dashboard.

## 🚀 Features

### Authentication Flows
- **User Registration** - Complete signup with profile information and validation
- **Email Verification** - Mandatory email verification before account activation
- **User Login** - Secure login with email and password
- **Two-Factor Authentication** - Email-based OTP 2FA required for all users
- **Forgot/Reset Password** - Secure password reset flow via email
- **Protected Routes** - Route protection with automatic redirects

### User Experience
- **Modern UI/UX** - Clean, responsive design using TailwindCSS and shadcn/ui
- **Form Validation** - Real-time client-side validation with user-friendly messages
- **Loading States** - Smooth loading indicators and micro-interactions
- **Error Handling** - Comprehensive error messaging and recovery flows
- **Session Management** - Automatic session timeout after 30 minutes of inactivity
- **Mobile Responsive** - Mobile-first design that works on all devices

### Technical Features
- **Global State Management** - React Context for authentication state
- **Supabase Integration** - Direct integration for auth flows
- **Backend API Integration** - Secure communication with FastAPI backend
- **TypeScript Ready** - Structured for easy TypeScript migration
- **Modular Architecture** - Reusable components and utilities

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── ui/                 # Reusable UI components (shadcn/ui style)
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── Card.js
│   │   ├── Alert.js
│   │   ├── Dialog.js
│   │   └── Loading.js
│   ├── auth/               # Authentication components
│   │   ├── SignUp.js
│   │   ├── Login.js
│   │   ├── TwoFactorAuth.js
│   │   ├── ForgotPassword.js
│   │   ├── ResetPassword.js
│   │   ├── EmailVerification.js
│   │   └── ProtectedRoute.js
│   └── dashboard/          # Dashboard components
│       └── Dashboard.js
├── contexts/               # React contexts
│   └── AuthContext.js
├── lib/                   # Utilities and configurations
│   ├── api.js             # Backend API client
│   ├── supabase.js        # Supabase client configuration
│   └── utils.js           # Utility functions
└── App.js                 # Main application with routing
```

### State Management
- **AuthContext** - Global authentication state management
- **Session Handling** - Automatic session timeout and activity tracking
- **Error Management** - Centralized error handling and user feedback

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 16+ and npm
- Supabase project setup
- Backend API running (FastAPI)

### Environment Variables
Create a `.env` file in the root directory:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key

# Site Configuration
REACT_APP_SITE_URL=http://localhost:3000

# Backend API Configuration
REACT_APP_BACKEND_URL=http://localhost:8000
```

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🔐 Authentication Flow

### 1. User Registration
- User fills signup form with personal information
- Client-side validation with real-time feedback
- Account created via backend API
- Email verification sent via Supabase
- Redirect to login with success message

### 2. Email Verification
- User clicks verification link from email
- Token validated via backend API
- Account activated and user redirected to login

### 3. User Login
- User enters email and password
- Credentials validated via backend API
- JWT token received and stored
- Redirect to 2FA verification

### 4. Two-Factor Authentication
- OTP sent to user's email via backend
- User enters 6-digit code
- Code verified via backend API
- Full authentication token received
- Redirect to dashboard

### 5. Dashboard Access
- Protected route checks authentication status
- User profile and account information displayed
- Session timeout handling with activity tracking
- Logout functionality

## 🎨 UI Components

### Design System
- **Colors**: Primary blue (#2563EB), Secondary gray (#64748B), Accent cyan (#22D3EE)
- **Typography**: Inter font family
- **Spacing**: Consistent Tailwind spacing scale
- **Animations**: Subtle micro-interactions and state transitions

### Reusable Components
- **Button**: Multiple variants (primary, secondary, outline, ghost, danger)
- **Input**: Form inputs with validation states and labels
- **Card**: Flexible card containers with header/content/footer
- **Alert**: Notification components with variant styles
- **Dialog**: Modal dialogs with overlay and animations
- **Loading**: Spinner components for various loading states

## 🔒 Security Features

### Client-Side Security
- **Input Validation**: Comprehensive form validation
- **Password Strength**: Enforced password complexity requirements
- **Session Management**: Automatic session timeout after inactivity
- **CSRF Protection**: Secure API communication patterns
- **Environment Variables**: Sensitive data stored securely

### API Integration
- **JWT Authentication**: Secure token-based authentication
- **Error Handling**: Secure error messages without data leakage
- **Rate Limiting**: Handled gracefully with user feedback
- **HTTPS Ready**: Production-ready secure communication

## 📱 Responsive Design

### Mobile-First Approach
- **Breakpoints**: Tailwind responsive breakpoints (sm, md, lg, xl)
- **Touch Targets**: Minimum 44px touch targets for mobile
- **Navigation**: Mobile-optimized navigation patterns
- **Forms**: Touch-friendly form inputs and interactions

### Cross-Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Polyfills**: Included via Create React App
- **Progressive Enhancement**: Graceful degradation for older browsers

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Configuration
- Update `REACT_APP_SITE_URL` to production domain
- Configure Supabase redirect URLs
- Set up proper CORS policies
- Enable SSL/HTTPS

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration flow
- [ ] Email verification
- [ ] Login with valid/invalid credentials
- [ ] 2FA with valid/invalid codes
- [ ] Password reset flow
- [ ] Session timeout
- [ ] Mobile responsiveness
- [ ] Error handling

### Future Testing
- Unit tests with Jest and React Testing Library
- Integration tests for authentication flows
- End-to-end tests with Cypress

## 🔮 Future Enhancements

### Planned Features
- **SSO Integration** - Google, GitHub, Microsoft login
- **Role-Based Access** - User roles and permissions
- **Profile Management** - Edit profile information
- **Session Management** - View and revoke active sessions
- **Security Settings** - Manage 2FA and security preferences

### Technical Improvements
- **TypeScript Migration** - Full TypeScript conversion
- **PWA Features** - Service worker and offline capabilities
- **Internationalization** - Multi-language support
- **Advanced Analytics** - User behavior tracking
- **Performance Optimization** - Code splitting and lazy loading

## 📚 Dependencies

### Core Dependencies
- **React 18.2.0** - UI library
- **React Router DOM 6.30.1** - Client-side routing
- **TailwindCSS 3.4.0** - Utility-first CSS framework
- **Supabase JS 2.56.0** - Backend-as-a-Service client

### UI & Form Libraries
- **Radix UI** - Accessible component primitives
- **React Hook Form 7.62.0** - Form management
- **Zod 4.1.1** - Schema validation
- **Lucide React 0.541.0** - Icon library

### Development Tools
- **Create React App 5.0.1** - Development toolchain
- **ESLint** - Code linting
- **PostCSS & Autoprefixer** - CSS processing

## 🤝 Contributing

### Development Guidelines
- Follow React best practices and hooks patterns
- Use TypeScript-ready patterns for future migration
- Maintain consistent component structure
- Write comprehensive JSDoc comments
- Test on multiple devices and browsers

### Code Style
- Use functional components with hooks
- Implement proper error boundaries
- Follow accessibility guidelines (WCAG 2.1)
- Maintain responsive design principles
- Use semantic HTML elements

## 📄 License

This project is part of the secure user authentication platform and follows the project's licensing terms.
