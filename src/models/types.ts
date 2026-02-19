export type Role = 'guest' | 'member' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  category: string;
  publicationYear: number;
  copiesTotal: number;
  copiesAvailable: number;
  coverUrl: string;
  previewPages?: string[]; // Added to store text for free preview pages
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string; // ISO string for simplicity in templates
  dueDate: string;
  returnDate: string | null;
  status: 'active' | 'returned' | 'overdue';
  fineAmount: number;
}