# Library Web App MVP

A modern, responsive library management system built with React, TypeScript, and Tailwind CSS. This application allows users to browse books, manage loans, write reviews, and track their reading history.

## 🚀 Features

### ✅ Completed Features

- **User Authentication**

  - Login and registration with JWT tokens
  - Protected routes and session management
  - Persistent authentication state

- **Book Management**

  - Browse books with search and filtering
  - View detailed book information
  - Grid and list view modes
  - Real-time stock tracking

- **Loan System**

  - Borrow books with optimistic UI updates
  - View loan history with status tracking
  - Return books functionality
  - Overdue book notifications

- **Review System**

  - Write and delete book reviews
  - Star ratings and comments
  - Optimistic UI updates for reviews
  - View all reviews for books

- **User Profile**

  - View and edit profile information
  - Library statistics dashboard
  - Reading history overview

- **Shopping Cart**
  - Add books to cart for batch borrowing
  - Remove items and clear cart
  - Stock availability checking

## 🛠 Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Redux Toolkit
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Date Handling**: Day.js
- **Notifications**: Sonner
- **Build Tool**: Vite

## 🏗 Architecture

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, Card, etc.)
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Navbar.tsx      # Navigation header
│   ├── Sidebar.tsx     # Side navigation
│   └── ProtectedRoute.tsx
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hooks
│   ├── useBooks.ts     # Book-related hooks
│   └── useUser.ts      # User profile hooks
├── lib/                # Utilities and configurations
│   ├── api.ts          # API client setup
│   └── utils.ts        # Helper functions
├── pages/              # Page components
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── HomePage.tsx
│   ├── BooksPage.tsx
│   ├── BookDetailPage.tsx
│   ├── LoansPage.tsx
│   ├── ProfilePage.tsx
│   └── CartPage.tsx
├── store/              # Redux store configuration
│   ├── index.ts        # Store setup
│   └── slices/         # Redux slices
│       ├── authSlice.ts
│       ├── uiSlice.ts
│       └── cartSlice.ts
└── types/              # TypeScript type definitions
    └── api.ts          # API response types
```

### Key Design Patterns

1. **Custom Hooks**: Encapsulate API calls and business logic
2. **Optimistic Updates**: Immediate UI feedback for better UX
3. **Component Composition**: Reusable UI components with shadcn/ui
4. **Type Safety**: Full TypeScript coverage with API schema types
5. **State Management**: Redux for global state, React Query for server state

## 🔧 API Integration

The application integrates with a REST API hosted at:
`https://belibraryformentee-production.up.railway.app`

### API Endpoints Used

- **Authentication**: `POST /api/auth/login`, `POST /api/auth/register`
- **Books**: `GET /api/books`, `GET /api/books/{id}`, `GET /api/books/recommend`
- **Loans**: `POST /api/loans`, `GET /api/loans/my`, `PATCH /api/loans/{id}/return`
- **Reviews**: `POST /api/reviews`, `GET /api/reviews/book/{bookId}`, `DELETE /api/reviews/{id}`
- **User Profile**: `GET /api/me`, `PATCH /api/me`, `GET /api/me/loans`, `GET /api/me/reviews`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd library-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   The `.env` file is already configured with:

   ```
   VITE_API_BASE_URL=https://belibraryformentee-production.up.railway.app
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## 📱 Features Overview

### Authentication Flow

- Users can register with name, email, and password
- Login returns JWT token stored in localStorage
- Protected routes redirect to login if not authenticated
- Persistent sessions across browser refreshes

### Book Browsing

- Search books by title, author, or ISBN
- Filter by categories and authors
- Sort by title, publication year, or rating
- Pagination for large result sets
- Grid and list view modes

### Borrowing System

- Add books to cart for batch borrowing
- Real-time stock checking
- Optimistic UI updates for instant feedback
- Loan status tracking (BORROWED, RETURNED, OVERDUE)
- Due date notifications and overdue warnings

### Review System

- 5-star rating system with optional comments
- Users can edit/delete their own reviews
- View all reviews for each book
- Average ratings displayed on book cards

### User Dashboard

- Personal library statistics
- Current loans and reading history
- Profile management with editable information
- Recent reviews overview

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success and error feedback
- **Optimistic Updates**: Instant UI feedback
- **Accessibility**: Keyboard navigation and screen reader support

## 🔄 State Management

### Redux Store Structure

- **authSlice**: User authentication and profile data
- **uiSlice**: Search filters, pagination, and UI state
- **cartSlice**: Shopping cart for batch book borrowing

### TanStack Query

- **Caching**: Intelligent caching with stale-while-revalidate
- **Background Updates**: Automatic data synchronization
- **Optimistic Updates**: Immediate UI feedback for mutations
- **Error Handling**: Automatic retry and error boundaries

## 🛡 Security Features

- JWT token authentication
- Automatic token refresh handling
- Protected API routes
- Input validation and sanitization
- XSS protection through React's built-in escaping

## 📝 Development Notes

### Code Quality

- TypeScript for type safety
- ESLint and Prettier for code formatting
- Component-based architecture
- Custom hooks for logic reuse
- Comprehensive error handling

### Performance Optimizations

- Code splitting with React.lazy()
- Image lazy loading
- Memoization of expensive computations
- Efficient re-rendering with proper dependency arrays
- Bundle size optimization with tree shaking

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [TanStack Query](https://tanstack.com/query) for excellent data fetching
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide React](https://lucide.dev/) for the icon system

---

Built with ❤️ using modern React and TypeScript
