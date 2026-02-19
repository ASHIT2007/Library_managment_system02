import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LibraryService } from '../../services/library.service';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-member',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div class="md:flex md:items-center md:justify-between mb-8">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            My Dashboard
          </h2>
          <p class="mt-1 text-sm text-gray-500">Welcome back, {{ auth.currentUser()?.name }}. Here are your borrowed books.</p>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <a routerLink="/" class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
            Browse Catalog
          </a>
        </div>
      </div>

      <div class="bg-white shadow-sm overflow-hidden sm:rounded-lg border border-gray-200">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Current Borrowings</h3>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {{ activeRecords().length }} Active
          </span>
        </div>
        
        @if (myRecords().length === 0) {
          <div class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No borrowed books</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by browsing our catalog.</p>
          </div>
        } @else {
          <ul class="divide-y divide-gray-200">
            @for (record of myRecords(); track record.id) {
              <li class="hover:bg-gray-50 transition-colors">
                <div class="px-4 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between">
                  <div class="flex items-center flex-1">
                    @if (record.book) {
                      <div class="flex-shrink-0 h-16 w-12 mr-4 bg-gray-200 rounded overflow-hidden hidden sm:block">
                        <img [src]="record.book.coverUrl" alt="" class="h-full w-full object-cover">
                      </div>
                      <div class="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                        <div>
                          <p class="text-sm font-medium text-primary-600 truncate mb-1">{{ record.book.title }}</p>
                          <p class="mt-2 flex items-center text-sm text-gray-500">
                            <span class="truncate">{{ record.book.author }}</span>
                          </p>
                        </div>
                        <div class="hidden md:block">
                          <div>
                            <p class="text-sm text-gray-900 mb-1">
                              Borrowed on <time [attr.datetime]="record.borrowDate">{{ record.borrowDate | date:'mediumDate' }}</time>
                            </p>
                            <p class="mt-2 flex items-center text-sm text-gray-500">
                              @if (record.status === 'returned') {
                                <span class="text-green-600 flex items-center">
                                  <svg class="flex-shrink-0 mr-1.5 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                                  Returned on {{ record.returnDate | date:'mediumDate' }}
                                </span>
                              } @else {
                                <span [class.text-red-600]="record.status === 'overdue'">
                                  Due on <time [attr.datetime]="record.dueDate">{{ record.dueDate | date:'mediumDate' }}</time>
                                </span>
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                  
                  <div class="mt-4 sm:mt-0 ml-5 flex-shrink-0 flex items-center gap-4">
                    <div class="flex flex-col items-end">
                      @if (record.status === 'active') {
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Active
                        </span>
                      } @else if (record.status === 'overdue') {
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Overdue (Fine: ₹{{ record.fineAmount }})
                        </span>
                      } @else {
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Returned
                        </span>
                      }
                    </div>
                    
                    @if (record.status !== 'returned') {
                      <!-- Client-side mock action. In real app, members return physically or admin marks returned -->
                      <button (click)="library.returnBook(record.id)" class="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 inline-flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Return
                      </button>
                    }
                  </div>
                </div>
              </li>
            }
          </ul>
        }
      </div>
    </main>
  `
})
export class MemberDashboardComponent {
  auth = inject(AuthService);
  library = inject(LibraryService);

  // Computed signal from service
  myRecords = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    // Access the computed signal returned by the method
    return this.library.getRecordsForUser(user.id)();
  });

  activeRecords = computed(() => this.myRecords().filter(r => r.status !== 'returned'));
}
