# ConnectiViz - Employee Management System

This is a [Next.js](https://nextjs.org/) project for employee management with advanced features.

## Features

- 🌙 **Dark Mode Default**: Application starts with dark theme by default
- 📝 **Employee Management**: Full CRUD operations for employee data
- 🔄 **Edit Modal**: In-page employee editing functionality
- 📄 **Export Features**: Export employee data to CSV, JSON, and PDF formats
- 🔍 **Filter & Search**: Advanced filtering and search capabilities
- 📊 **Rich UI**: Modern interface with charts and data visualization
- 🔐 **Authentication**: Secure login and user management

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd connectiviz-adviz
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
# Add other required environment variables
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

```bash
npm run build
npm run start
```

## Deployment

### Deploy on Vercel

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your project to [Vercel](https://vercel.com/new)
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
   - Add other required environment variables
4. Deploy!

### Deploy on Other Platforms

The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- Render
- DigitalOcean App Platform

Make sure to:
1. Set the build command to `npm run build`
2. Set the start command to `npm run start`
3. Configure environment variables
4. Ensure Node.js version 18.17+

## Project Structure

```
src/
├── app/                 # Next.js 13+ App Router
├── components/          # React components
│   ├── employee/       # Employee-related components
│   ├── ui/            # UI components
│   └── ...
├── context/            # React contexts (Theme, Auth)
├── store/              # Redux store and slices
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── ...
```

## Key Features Implemented

### 1. Dark Mode Default
- Application always starts in dark mode
- Users can switch to light mode via UI toggle
- No localStorage dependency - always defaults to dark

### 2. Employee Edit Modal
- In-place editing without navigation
- Form validation with error handling
- Real-time data updates

### 3. Export Functionality
- **CSV Export**: Spreadsheet-compatible format
- **JSON Export**: Developer-friendly format  
- **PDF Export**: Professional document format using jsPDF

### 4. Filter & Search
- Multi-criteria filtering (role, status, division)
- Real-time search across employee data
- Advanced filter modal interface

## Environment Variables

```env
# Required
NEXT_PUBLIC_API_URL=your_backend_api_url

# Optional
NODE_ENV=production
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking

## Tech Stack

- **Framework**: Next.js 15.3.3
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Redux Toolkit
- **Type Safety**: TypeScript
- **Icons**: Lucide React
- **PDF Generation**: jsPDF + jspdf-autotable
- **Forms**: React Hook Form + Zod validation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
