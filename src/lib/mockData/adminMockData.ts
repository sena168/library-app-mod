import type { AdminUser } from '../types/adminTypes';

// Mock user data for admin panel demonstration
// In a real application, this data would come from the API
export const mockUsers: AdminUser[] = [
  {
    id: 1,
    name: 'Bestari',
    email: 'admin@library.local',
    role: 'ADMIN',
    createdAt: '2024-01-15T10:30:00Z',
    phone: '+62 812-3456-7890',
    profilePicture: undefined,
  },
  {
    id: 2,
    name: 'John Smith',
    email: 'john.smith@email.com',
    role: 'USER',
    createdAt: '2024-01-20T14:15:00Z',
    phone: '+62 813-4567-8901',
    profilePicture: undefined,
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    role: 'USER',
    createdAt: '2024-01-25T09:45:00Z',
    phone: '+62 814-5678-9012',
    profilePicture: undefined,
  },
  {
    id: 4,
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    role: 'USER',
    createdAt: '2024-02-01T16:20:00Z',
    phone: '+62 815-6789-0123',
    profilePicture: undefined,
  },
  {
    id: 5,
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    role: 'USER',
    createdAt: '2024-02-05T11:30:00Z',
    phone: '+62 816-7890-1234',
    profilePicture: undefined,
  },
  {
    id: 6,
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    role: 'USER',
    createdAt: '2024-02-10T13:45:00Z',
    phone: '+62 817-8901-2345',
    profilePicture: undefined,
  },
  {
    id: 7,
    name: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    role: 'USER',
    createdAt: '2024-02-15T08:15:00Z',
    phone: '+62 818-9012-3456',
    profilePicture: undefined,
  },
  {
    id: 8,
    name: 'Robert Taylor',
    email: 'robert.taylor@email.com',
    role: 'USER',
    createdAt: '2024-02-20T15:30:00Z',
    phone: '+62 819-0123-4567',
    profilePicture: undefined,
  },
  {
    id: 9,
    name: 'Jennifer Martinez',
    email: 'jennifer.martinez@email.com',
    role: 'USER',
    createdAt: '2024-02-25T12:00:00Z',
    phone: '+62 820-1234-5678',
    profilePicture: undefined,
  },
  {
    id: 10,
    name: 'Christopher Lee',
    email: 'christopher.lee@email.com',
    role: 'USER',
    createdAt: '2024-03-01T17:45:00Z',
    phone: '+62 821-2345-6789',
    profilePicture: undefined,
  },
];

// Mock overview data for admin panel demonstration
export const mockOverview = {
  totals: {
    users: 10,
    books: 7,
  },
  loans: {
    active: 13,
    overdue: 3,
  },
  topBorrowed: [
    {
      id: 1,
      title: 'Clean Code',
      borrowCount: 7,
      rating: 4.67,
      availableCopies: 1,
      totalCopies: 5,
      author: {
        id: 2,
        name: 'kurada pelago',
      },
      category: {
        id: 5,
        name: 'technology',
      },
    },
    {
      id: 2,
      title: "Harry Potter and the Sorcerer's Stone",
      borrowCount: 4,
      rating: 5,
      availableCopies: 8,
      totalCopies: 10,
      author: {
        id: 9,
        name: 'Rowling, J.K.',
      },
      category: {
        id: 9,
        name: 'Fiction',
      },
    },
  ],
};
