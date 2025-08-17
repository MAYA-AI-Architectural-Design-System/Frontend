# Maya AI Website - Complete Documentation

## 🚀 Project Overview

Maya AI Website is a modern, multilingual Next.js application that serves as a platform for AI-powered architectural visualization and renovation services. The website features a comprehensive admin dashboard, user authentication, chat functionality, and a beautiful UI built with modern web technologies.

## 🏗️ Architecture Overview

This project follows a **Next.js 14 App Router** architecture with the following key features:

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **UI Components**: Shadcn/ui component library
- **Styling**: Tailwind CSS with custom design system
- **Internationalization**: Next-i18next for multi-language support
- **Authentication**: Custom auth system with protected routes
- **Admin Dashboard**: Comprehensive admin panel with analytics
- **Responsive Design**: Mobile-first approach with modern UI/UX

## 📁 Project Structure

```
maya-ai-website/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication routes (grouped)
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── chat/              # Chat functionality
│   │   ├── contexts/          # React contexts
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Shadcn/ui components
│   │   └── [custom components]
│   ├── lib/                   # Utility libraries and APIs
│   ├── hooks/                 # Custom React hooks
│   ├── locales/               # Translation files
│   └── utils/                 # Helper functions
├── public/                    # Static assets
│   ├── locales/              # i18n translation files
│   └── images/               # Image assets
└── [config files]            # Configuration files
```

## 🛠️ Technology Stack

### Core Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React 18** - Modern React with hooks

### UI & Components

- **Shadcn/ui** - Modern component library
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Tailwind CSS** - CSS framework

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone [your-repo-url]
   cd maya-ai-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Key Features Explained

### 1. Authentication System

The app includes a complete authentication system with:

- User registration and login
- Password reset functionality
- Protected routes
- Admin authentication

**Location**: `src/app/(auth)/` and `src/lib/auth.ts`

### 2. Admin Dashboard

A comprehensive admin panel featuring:

- User management
- Analytics and metrics
- Chat monitoring
- Project management
- Security settings

**Location**: `src/app/admin/`

### 3. Internationalization (i18n)

Multi-language support using Next-i18next:

- English and Amharic support
- Dynamic language switching
- Context-based language management

**Location**: `src/contexts/language-context.tsx` and `public/locales/`

### 4. Chat System

Real-time chat functionality:

- User chat interface
- Admin chat monitoring
- Message history

**Location**: `src/app/chat/`

### 5. Component System

Well-organized component architecture:

- **UI Components**: `src/components/ui/` - Shadcn/ui components
- **Custom Components**: `src/components/` - Project-specific components
- **Layout Components**: Header, Footer, Navigation

## 🔧 Development Guidelines

### Code Organization

- **Components**: Place reusable components in `src/components/`
- **Pages**: Use Next.js App Router structure in `src/app/`
- **Utilities**: Keep helper functions in `src/lib/` and `src/utils/`
- **Types**: Define TypeScript interfaces in component files or dedicated type files

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use CSS variables for theme customization

### Component Structure

```tsx
// Example component structure
import React from "react";
import { ComponentProps } from "./types";

export const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic here

  return <div className="component-classes">{/* Component JSX */}</div>;
};
```

## 🌐 Internationalization

### Adding New Languages

1. Create new locale file in `public/locales/[lang]/common.json`
2. Add language to `next-i18next.config.js`
3. Update language context in `src/contexts/language-context.tsx`

### Using Translations

```tsx
import { useTranslation } from "next-i18next";

const Component = () => {
  const { t } = useTranslation("common");

  return <h1>{t("welcome.title")}</h1>;
};
```

## 🔐 Authentication & Security

### Protected Routes

Routes are protected using the `ProtectedRoute` component:

```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Protected content here</div>
    </ProtectedRoute>
  );
}
```

### Admin Routes

Admin routes are protected and require admin privileges:

```tsx
// Located in src/app/admin/layout.tsx
```

## 📱 Responsive Design

The website is built with a mobile-first approach:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Breakpoint Usage

```tsx
// Tailwind CSS responsive classes
<div className="w-full md:w-1/2 lg:w-1/3">{/* Responsive content */}</div>
```

## 🎨 UI/UX Design System

### Color Palette

- Primary colors defined in Tailwind config
- Consistent spacing scale
- Typography hierarchy

### Component Variants

Shadcn/ui components with consistent variants:

- Button variants: default, destructive, outline, secondary, ghost, link
- Input variants: default, error, success
- Card variants: default, elevated

## 🚀 Deployment

### Build Process

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Required environment variables:

- `NEXT_PUBLIC_API_URL` - API endpoint
- `NEXTAUTH_SECRET` - Authentication secret
- `NEXTAUTH_URL` - Authentication URL

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📖 API Documentation

### Chat API

- **Endpoint**: `/api/chat`
- **Methods**: GET, POST
- **Authentication**: Required

### Admin API

- **Endpoint**: `/api/admin/*`
- **Methods**: GET, POST, PUT, DELETE
- **Authentication**: Admin required

### Authentication API

- **Endpoints**: `/api/auth/*`
- **Methods**: POST
- **Features**: Login, Register, Password Reset

## 🔍 Troubleshooting

### Common Issues

1. **Build Errors**

   - Clear `.next` folder
   - Reinstall dependencies
   - Check TypeScript errors

2. **Authentication Issues**

   - Verify environment variables
   - Check session configuration
   - Clear browser cookies

3. **Styling Issues**
   - Verify Tailwind CSS configuration
   - Check PostCSS setup
   - Ensure CSS imports are correct

### Debug Mode

Enable debug logging:

```bash
DEBUG=* npm run dev
```

## 🤝 Contributing

### Development Workflow

1. Create feature branch
2. Make changes following coding standards
3. Test thoroughly
4. Submit pull request
5. Code review and merge

### Code Standards

- Use TypeScript for all new code
- Follow ESLint configuration
- Write meaningful commit messages
- Add JSDoc comments for complex functions

## 📚 Additional Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Learning Path for Beginners

1. **Start with**: Basic HTML, CSS, JavaScript
2. **Learn**: React fundamentals and hooks
3. **Understand**: Next.js App Router
4. **Master**: TypeScript and Tailwind CSS
5. **Explore**: Component libraries and state management

## 📞 Support

For questions or support:

- Check existing documentation
- Review code examples
- Consult team members
- Create detailed issue reports

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Maintainer**: Maya AI Development Team
