# Connectiviz Dashboard

<p align="center">
  <img src="https://nextjs.org/static/favicon/android-chrome-192x192.png" width="120" alt="Next.js Logo" />
</p>

<p align="center">
  <strong>Enterprise HR Management Dashboard</strong><br>
  Advanced web application for comprehensive employee management, organizational analytics, and business intelligence.
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## 🏢 Overview

ConnectiViz Dashboard is a modern, enterprise-grade HR management system built with Next.js 15 and TypeScript. It serves as the central hub for employee management, organizational analytics, and business intelligence across multiple applications in the ConnectiViz ecosystem.

### System Architecture
- **Primary Dashboard**: ConnectiViz (Advanced HR analytics & management)
- **Employee Portal**: Integration with Naruku (Self-service employee application)
- **Analytics Platform**: Business intelligence and reporting capabilities
- **SSO Gateway**: Single Sign-On authentication across all applications

### Key Business Value
- **Centralized Employee Management**: Complete employee lifecycle management from onboarding to performance tracking
- **Real-time Analytics**: Interactive dashboards with comprehensive business insights
- **Organizational Visualization**: Dynamic organizational charts and business unit management
- **Multi-Application Integration**: Seamless navigation between different HR applications
- **Enterprise Security**: Advanced authentication and role-based access control

---

## 🎯 Features

### 🔐 Authentication & Security
- **JWT-based Authentication**: Secure token-based authentication system
- **Single Sign-On (SSO)**: Seamless authentication across multiple applications
- **Role-based Access Control**: Granular permissions for SUPER_ADMIN, ADMIN, and EMPLOYEE roles
- **Protected Routes**: Secure page access based on user roles and permissions
- **Session Management**: Automatic token refresh and logout functionality

### 👥 Employee Management
- **Employee Directory**: Comprehensive employee listing with advanced filtering and search
- **Profile Management**: Complete employee profiles with personal and professional information
- **Photo Management**: Profile photo upload and management with Supabase integration
- **Employee Forms**: Dynamic form creation and editing with validation
- **Employee Monitoring**: Real-time employee status and activity tracking

### 🏗️ Organizational Structure
- **Business Units**: Create and manage organizational business units
- **Division Management**: Hierarchical division and department structure
- **Organization Chart**: Interactive organizational chart visualization
- **Team Management**: Employee assignment and team structure management

### 📊 Analytics & Reporting
- **Interactive Dashboards**: Real-time business intelligence dashboards
- **Data Visualization**: Advanced charts and graphs using ApexCharts and Recharts
- **Performance Metrics**: Employee and organizational performance tracking
- **Business Analytics**: Comprehensive business insights and reporting
- **Geographic Visualization**: World map integration for global workforce analytics

### 🚀 Application Integration
- **Application Launcher**: Central hub for accessing multiple applications
- **SSO Integration**: Single sign-on capability across the entire ecosystem
- **Multi-Application Navigation**: Seamless navigation between ConnectiViz, Naruku, and other applications
- **API Integration**: RESTful API integration with the ConnectiViz backend

### 💻 User Experience
- **Responsive Design**: Mobile-first, responsive design for all devices
- **Dark/Light Mode**: Theme switching for user preference
- **Modern UI Components**: Professional UI using Radix UI and PrimeReact
- **Interactive Elements**: Drag & drop functionality, modal dialogs, and dynamic forms
- **Performance Optimized**: Fast loading times with Next.js optimization

---

## 🛠️ Tech Stack

### Core Framework
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Framework** | Next.js 15.3.3 | React-based web framework with App Router |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS 4.0 | Utility-first CSS framework |
| **State Management** | Redux Toolkit | Global state management |

### UI & Components
| Component | Technology | Purpose |
|-----------|------------|---------|
| **UI Library** | Radix UI | Accessible, unstyled UI primitives |
| **Component Library** | PrimeReact | Professional React components |
| **Icons** | Lucide React, Heroicons | Modern icon libraries |
| **Animations** | TW Animate CSS | Smooth animations and transitions |

### Data Visualization
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Charts** | ApexCharts, Recharts | Interactive data visualization |
| **Maps** | JVectorMap | World map visualization |
| **Calendar** | FullCalendar | Event and schedule management |

### Forms & Validation
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Forms** | React Hook Form | Form handling and validation |
| **Validation** | Zod | Schema validation |
| **File Upload** | React Dropzone | File upload interface |

### Integration & API
| Component | Technology | Purpose |
|-----------|------------|---------|
| **HTTP Client** | Axios | API communication |
| **File Storage** | Supabase | Cloud file storage |
| **Authentication** | JWT | Token-based authentication |

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 20.0.0
- npm or yarn package manager
- ConnectiViz Backend API running

### Installation
```bash
# Clone repository
git clone <repository-url>
cd connectiviz

# Install dependencies
npm install

# Environment setup
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Environment Configuration
Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_NARUKU_URL=http://localhost:3002

# Supabase Configuration (for file uploads)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Application Settings
NEXT_PUBLIC_APP_NAME=ConnectiViz
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Development Commands
```bash
npm run dev          # Start development server (port 3001)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking
npm run clean        # Clean build artifacts
```

---

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (admin)/           # Admin dashboard pages
│   │   ├── (list-pages)/  # List management pages
│   │   └── (ui-elements)/ # UI component examples
│   ├── (full-width-pages)/ # Full-width layout pages
│   └── profile/           # User profile pages
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── employee/         # Employee management
│   ├── charts/           # Data visualization
│   ├── forms/            # Form components
│   ├── ui/               # Base UI components
│   └── common/           # Shared components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── services/             # API service functions
├── store/                # Redux store configuration
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── validation/           # Form validation schemas
```

---

## 🔒 Security & Access Control

### Authentication Flow
1. **User Login**: JWT-based authentication with the backend API
2. **Token Storage**: Secure token storage in localStorage
3. **Route Protection**: Automatic redirection for unauthenticated users
4. **Role Validation**: Component-level access control based on user roles

### Role-Based Access Control (RBAC)
- **SUPER_ADMIN**: Full system access and configuration
- **ADMIN**: Administrative operations and user management
- **EMPLOYEE**: Limited access to personal dashboard and profile

### Security Features
- **Protected Routes**: HOC-based route protection
- **API Security**: Automatic token injection for API requests
- **Input Validation**: Client-side validation with Zod schemas
- **XSS Protection**: Sanitized user inputs and secure rendering

---

## 📊 Key Features & Screens

### Dashboard
- **Main Dashboard**: Overview of key metrics and recent activities
- **Employee Dashboard**: Personalized employee information and quick actions
- **Analytics Dashboard**: Business intelligence and performance metrics

### Employee Management
- **Employee List**: Comprehensive employee directory with search and filters
- **Employee Details**: Detailed employee profiles with all information
- **Employee Forms**: Create and edit employee records
- **Profile Management**: Employee photo upload and profile updates

### Organization Management
- **Business Units**: Create and manage organizational units
- **Divisions**: Hierarchical division management
- **Organization Chart**: Visual representation of organizational structure

### Application Integration
- **Application Launcher**: Central hub for accessing multiple applications
- **SSO Status**: Real-time SSO authentication status
- **Multi-App Navigation**: Seamless navigation between applications

---

## 🚀 Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables (Production)
```env
# API Configuration (Production)
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# Application URLs (Production)
NEXT_PUBLIC_APP_URL=https://dashboard.your-domain.com
NEXT_PUBLIC_NARUKU_URL=https://naruku.your-domain.com

# Supabase Configuration (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-supabase-key
```

### Deployment Options
- **Vercel**: Optimized for Next.js applications
- **Netlify**: Static site deployment with serverless functions
- **Docker**: Containerized deployment for enterprise environments
- **AWS/Azure**: Cloud deployment with CDN and global distribution

---

## 🧪 Testing & Quality

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Next.js configuration
- **Prettier**: Code formatting (if configured)
- **Type Safety**: 100% TypeScript implementation

### Performance
- **Next.js Optimization**: Built-in performance optimizations
- **Code Splitting**: Automatic code splitting and lazy loading
- **Image Optimization**: Next.js Image component for optimized images
- **Bundle Analysis**: Build analysis for optimization opportunities

---

## 🔧 Development Guidelines

### Component Structure
```typescript
// Example component structure
export interface ComponentProps {
  // Props interface
}

export default function Component({ props }: ComponentProps) {
  // Component logic
  return (
    // JSX
  );
}
```

### State Management
- Use Redux Toolkit for global state
- React Context for component-specific state
- Custom hooks for reusable logic

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow responsive design principles
- Implement dark mode support
- Use consistent spacing and typography

---

## 📖 Additional Resources

### Documentation
- **[Next.js Documentation](https://nextjs.org/docs)** - Framework documentation
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Styling documentation
- **[Redux Toolkit](https://redux-toolkit.js.org/)** - State management
- **[React Hook Form](https://react-hook-form.com/)** - Form handling

### API Integration
- **Backend API**: ConnectiViz Backend API documentation
- **Supabase**: File storage and authentication
- **Chart Libraries**: ApexCharts and Recharts documentation

---

## 🤝 Support & Contributing

### Development Team
- **Frontend Team**: [Insert contact information]
- **Backend Integration**: [Insert contact information]
- **UI/UX Design**: [Insert contact information]

### Contributing Guidelines
1. Follow TypeScript best practices
2. Use consistent naming conventions
3. Implement proper error handling
4. Add type definitions for all components
5. Follow the established project structure

---

<p align="center">
  <strong>ConnectiViz Dashboard</strong><br>
  Enterprise HR Management System<br><br>
  Built with ❤️ by Adviz Team
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a>
</p>
