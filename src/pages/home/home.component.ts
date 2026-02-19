import { Component, inject } from '@angular/core';
import { LibraryService } from '../../services/library.service';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BookCardComponent, FormsModule],
  template: `
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Hero Section -->
      <div class="bg-primary-700 rounded-2xl p-8 sm:p-12 mb-8 text-white shadow-lg relative overflow-hidden">
        <div class="absolute top-0 right-0 -mt-16 -mr-16 opacity-10">
          <svg width="400" height="400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        </div>
        <div class="relative z-10 max-w-2xl">
          <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Discover Your Next Great Read</h1>
          <p class="text-lg sm:text-xl text-primary-100 mb-8 max-w-xl">Explore our vast collection of books, from timeless classics to modern masterpieces. Read, learn, and grow with LibraFlow.</p>
          
          <!-- Search Bar -->
          <div class="relative max-w-xl flex items-center">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              [ngModel]="library.searchQuery()"
              (ngModelChange)="onSearchChange($event)"
              class="block w-full pl-10 pr-3 py-4 border border-transparent rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-700 focus:ring-white focus:border-white sm:text-sm shadow-md transition-shadow"
              placeholder="Search by title, author, or ISBN..."
            >
          </div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-8">
        <!-- Sidebar Filters -->
        <aside class="w-full md:w-64 flex-shrink-0">
          <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
              Categories
            </h2>
            <ul class="space-y-2">
              @for (category of library.categories(); track category) {
                <li>
                  <button 
                    (click)="setCategory(category)"
                    class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center"
                    [class.bg-primary-50]="library.selectedCategory() === category"
                    [class.text-primary-700]="library.selectedCategory() === category"
                    [class.font-medium]="library.selectedCategory() === category"
                    [class.text-gray-600]="library.selectedCategory() !== category"
                    [class.hover:bg-gray-50]="library.selectedCategory() !== category"
                  >
                    <span>{{ category }}</span>
                  </button>
                </li>
              }
            </ul>
          </div>
        </aside>

        <!-- Catalog Grid -->
        <div class="flex-grow">
          <div class="mb-4 flex justify-between items-end">
            <h2 class="text-2xl font-bold text-gray-900">Catalog</h2>
            <span class="text-sm text-gray-500">Showing {{ library.filteredBooks().length }} books</span>
          </div>

          @if (library.filteredBooks().length === 0) {
            <div class="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm mt-4">
              <svg class="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-1">No books found</h3>
              <p class="text-gray-500 text-sm">Try adjusting your search or category filter.</p>
              <button (click)="resetFilters()" class="mt-4 text-primary-600 hover:text-primary-800 text-sm font-medium">
                Clear all filters
              </button>
            </div>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              @for (book of library.filteredBooks(); track book.id) {
                <app-book-card [book]="book"></app-book-card>
              }
            </div>
          }
        </div>
      </div>
    </main>
  `
})
export class HomeComponent {
  library = inject(LibraryService);

  onSearchChange(query: string) {
    this.library.searchQuery.set(query);
  }

  setCategory(category: string) {
    this.library.selectedCategory.set(category);
  }

  resetFilters() {
    this.library.searchQuery.set('');
    this.library.selectedCategory.set('All');
  }
}
