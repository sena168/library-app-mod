# this is the modified app

# Library Web Application MVP

An up-to-date, adaptable library management platform developed using React, TypeScript, and Tailwind CSS. Users can explore available books, handle borrowing, submit reviews, and monitor their reading activity.

## 🚀 Highlights

### ✅ Finished Capabilities

- **Account Access**

  - Sign in and register with JWT authentication
  - Restricted pages and session control
  - Authentication persists between sessions

- **Book Handling**

  - Search and filter through book listings
  - Access comprehensive book details
  - Switch between grid or list displays
  - Live inventory monitoring

- **Borrowing Feature**

  - Borrow books with instant UI response
  - Review borrowing history and status
  - Return borrowed items
  - Alerts for overdue returns

- **Review Functionality**

  - Add or remove book reviews
  - Rate books and leave comments
  - Immediate UI updates for review actions
  - Browse all feedback for each title

- **User Account**

  - View and update personal details
  - Dashboard with library usage stats
  - Overview of reading records

- **Batch Borrowing**
  - Place multiple books in a cart for borrowing
  - Remove or clear cart items
  - Check stock before borrowing

## 🛠 Technology Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Redux Toolkit
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **HTTP Requests**: Axios
- **Date Handling**: Day.js
- **Notifications**: Sonner
- **Build Tool**: Vite
- **Testing**: Vitest
- **Linting & Formatting**: ESLint, Prettier
- **Icons**: Lucide React

## 🏗 Structure

### Folder Layout

```
src/
├── components/          # Modular UI elements
│   ├── ui/             # Basic UI (Button, Input, Card, etc.)
│   ├── Layout.tsx      # Main page wrapper
│   ├── Navbar.tsx      # Top navigation
│   ├── Sidebar.tsx     # Side menu
│   └── ProtectedRoute.tsx
├── hooks/              # Custom hooks for logic
│   ├── useAuth.ts      # Auth-related hooks
│   ├── useBooks.ts     # Book logic hooks
│   └── useUser.ts      # User info hooks
├── lib/                # Configs and utilities
│   ├── api.ts          # API client setup
│   └── utils.ts        # Helper functions
├── pages/              # Main page components
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── HomePage.tsx
│   ├── BooksPage.tsx
│   ├── BookDetailPage.tsx
│   ├── LoansPage.tsx
│   ├── ProfilePage.tsx
│   └── CartPage.tsx
├── store/              # Redux store setup
│   ├── index.ts        # Store configuration
│   └── slices/         # Redux slices
│       ├── authSlice.ts
│       ├── uiSlice.ts
│       └── cartSlice.ts
└── types/              # TypeScript types
    └── api.ts          # API response types
```

### Main Patterns

1. **Custom Hooks**: API and logic encapsulation
2. **Optimistic UI**: Fast feedback for user actions
3. **Composable Components**: Reusable UI via shadcn/ui
4. **Type Safety**: Strong typing with TypeScript
5. **State Handling**: Redux for app state, React Query for server data

## 🔧 API Usage

Connects to a REST API at:
`https://belibraryformentee-production.up.railway.app`

### Endpoints

- **Auth**: `POST /api/auth/login`, `POST /api/auth/register`
- **Books**: `GET /api/books`, `GET /api/books/{id}`, `GET /api/books/recommend`
- **Loans**: `POST /api/loans`, `GET /api/loans/my`, `PATCH /api/loans/{id}/return`
- **Reviews**: `POST /api/reviews`, `GET /api/reviews/book/{bookId}`, `DELETE /api/reviews/{id}`
- **User**: `GET /api/me`, `PATCH /api/me`, `GET /api/me/loans`, `GET /api/me/reviews`

## 🚀 Quick Start

### Requirements

- Node.js 18 or newer
- Updated web browser

### Setup

1. **Clone the project**

   ```bash
   git clone <repository-url>
   cd library-app
   ```

2. **Install packages**

   ```bash
   npm install
   ```

3. **Configure environment**
   The `.env` file includes:

   ```
   VITE_API_BASE_URL=https://belibraryformentee-production.up.railway.app
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Access in browser**
   Go to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 📱 Feature Summary

### Login & Registration

- Register with name, email, password
- Login provides JWT stored in localStorage
- Protected pages redirect if not logged in
- Sessions persist after refresh

### Book Discovery

- Search by title, author, ISBN
- Filter by category or author
- Sort by title, year, rating
- Paginated results
- Grid or list display options

### Borrowing

- Add books to cart for group borrowing
- Check stock instantly
- UI updates immediately after actions
- Track loan status (BORROWED, RETURNED, OVERDUE)
- Get notified about due dates and overdue items

### Reviews

- Rate books (1-5 stars) and comment
- Edit or remove your reviews
- See all feedback for each book
- Average ratings shown on book cards

### User Area

- View personal library stats
- See current loans and reading history
- Update profile details
- Recent reviews summary

## 🎨 UI/UX Details

- **Mobile Friendly**: Works on all devices
- **Loading Feedback**: Skeletons and spinners
- **Error Messages**: Clear user alerts
- **Toasts**: Success/error notifications
- **Optimistic UI**: Fast response to actions
- **Accessibility**: Keyboard and screen reader support

## 🔄 State Handling

### Redux Slices

- **authSlice**: Auth and user info
- **uiSlice**: Filters, pagination, UI state
- **cartSlice**: Cart for borrowing

### TanStack Query

- **Cache**: Smart caching and updates
- **Sync**: Background data refresh
- **Optimistic UI**: Fast mutation feedback
- **Error Handling**: Retries and boundaries

## 🛡 Security

- JWT-based authentication
- Automatic token renewal
- Protected API endpoints
- Input checks and sanitization
- XSS protection via React

## 📝 Dev Practices

### Code Quality

- TypeScript for types
- ESLint/Prettier for formatting
- Modular components
- Custom hooks for shared logic
- Robust error handling

### Performance

- Code splitting with React.lazy
- Lazy load images
- Memoize heavy calculations
- Efficient re-renders
- Smaller bundles with tree shaking

## 🙏 Credits

- [shadcn/ui](https://ui.shadcn.com/) for UI elements
- [TanStack Query](https://tanstack.com/query) for data management
- [Redux Toolkit](https://redux-toolkit.js.org/) for state
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide React](https://lucide.dev/) for icons
- [Vitest](https://vitest.dev/) for testing
- [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for code quality

---

Created with 🫶 using React and TypeScript
