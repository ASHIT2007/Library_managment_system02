import { Injectable, signal, computed } from '@angular/core';
import { User, Role } from '../models/types';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly MOCK_USERS: Record<string, User> = {
    'member': { id: 'u1', name: 'Alice Student', email: 'alice@university.edu', role: 'member' },
    'admin': { id: 'u2', name: 'Bob Librarian', email: 'bob@library.org', role: 'admin' }
  };

  currentUser = signal<User | null>(null);
  
  isLoggedIn = computed(() => this.currentUser() !== null);
  isMember = computed(() => this.currentUser()?.role === 'member');
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor(private router: Router) {}

  login(role: 'member' | 'admin') {
    this.currentUser.set(this.MOCK_USERS[role]);
    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  logout() {
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }
}
