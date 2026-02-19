import { Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { LibraryService } from '../../services/library.service';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <a routerLink="/" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-8 transition-colors">
        <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Catalog
      </a>

      @if (book(); as b) {
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="md:flex">
            <!-- Cover Image -->
            <div class="md:flex-shrink-0 md:w-1/3 bg-gray-50 p-8 flex justify-center items-center">
              <img [src]="b.coverUrl" [alt]="b.title" class="max-w-full h-auto rounded-lg shadow-lg" />
            </div>
            
            <!-- Details -->
            <div class="p-8 md:w-2/3 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <p class="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-1">{{ b.category }}</p>
                    <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-2">{{ b.title }}</h1>
                    <p class="text-xl text-gray-600 font-medium">{{ b.author }}</p>
                  </div>
                  
                  <div class="text-right flex flex-col items-end">
                    @if (b.copiesAvailable > 0) {
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 shadow-sm border border-green-200">
                        <span class="w-2 h-2 mr-2 bg-green-500 rounded-full"></span>
                        Available
                      </span>
                    } @else {
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 shadow-sm border border-red-200">
                        <span class="w-2 h-2 mr-2 bg-red-500 rounded-full"></span>
                        Out of Stock
                      </span>
                    }
                    <p class="text-sm text-gray-500 mt-2">{{ b.copiesAvailable }} of {{ b.copiesTotal }} available</p>
                  </div>
                </div>

                <div class="prose prose-blue text-gray-600 mb-8 max-w-none">
                  <p class="leading-relaxed">{{ b.description }}</p>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8 py-6 border-y border-gray-100">
                  <div>
                    <dt class="text-xs font-medium text-gray-500 uppercase">ISBN</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ b.isbn }}</dd>
                  </div>
                  <div>
                    <dt class="text-xs font-medium text-gray-500 uppercase">Published</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ b.publicationYear }}</dd>
                  </div>
                  <div>
                    <dt class="text-xs font-medium text-gray-500 uppercase">Total Copies</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ b.copiesTotal }}</dd>
                  </div>
                </div>
              </div>

              <!-- Action Area -->
              <div class="bg-gray-50 -mx-8 -mb-8 p-8 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                <div>
                  @if (!auth.isLoggedIn()) {
                    <p class="text-sm text-gray-600 mb-2">Please log in to borrow this book.</p>
                  } @else if (auth.isMember()) {
                    <p class="text-sm text-gray-600 mb-2">Borrowing duration is 14 days.</p>
                  }
                </div>
                
                <div class="flex gap-3">
                  @if (b.previewPages && b.previewPages.length > 0) {
                    <button 
                      (click)="togglePreview()" 
                      class="inline-flex items-center justify-center px-6 py-3 border border-primary-300 text-base font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 shadow-sm transition-all focus:outline-none"
                    >
                      Read Free Preview
                    </button>
                  }

                  @if (!auth.isLoggedIn()) {
                    <a routerLink="/login" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 shadow-sm">
                      Log In to Borrow
                    </a>
                  } @else if (auth.isMember()) {
                    <button 
                      (click)="borrowBook()" 
                      [disabled]="b.copiesAvailable === 0 || isProcessing()"
                      class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      [class.bg-primary-600]="b.copiesAvailable > 0 && !isProcessing()"
                      [class.hover:bg-primary-700]="b.copiesAvailable > 0 && !isProcessing()"
                      [class.bg-gray-400]="b.copiesAvailable === 0 || isProcessing()"
                      [class.cursor-not-allowed]="b.copiesAvailable === 0 || isProcessing()"
                    >
                      @if (isProcessing()) {
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Processing...
                      } @else if (b.copiesAvailable > 0) {
                        Borrow Book
                      } @else {
                        Unavailable
                      }
                    </button>
                  } @else if (auth.isAdmin()) {
                    <button class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                      Edit Book (Admin)
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Free Preview E-Reader Overlay/Section -->
        @if (showPreview() && b.previewPages) {
          <div class="mt-12 bg-[#F9F6EE] border-2 border-[#E8DCC4] rounded-xl shadow-xl overflow-hidden transition-all animate-fade-in-up">
            <div class="bg-[#E8DCC4] px-6 py-4 flex justify-between items-center border-b border-[#D8C7A5]">
              <h3 class="font-serif font-bold text-gray-800 text-lg flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                Preview: {{ b.title }}
              </h3>
              <button (click)="togglePreview()" class="text-gray-600 hover:text-gray-900 bg-white/50 px-3 py-1 rounded-md text-sm font-medium transition-colors">
                Close Preview
              </button>
            </div>
            
            <div class="p-8 sm:p-12 md:px-24">
              <div class="prose prose-lg prose-amber max-w-2xl mx-auto font-serif text-gray-800 leading-loose whitespace-pre-wrap">
                {{ b.previewPages[currentPreviewPage()] }}
              </div>
            </div>
            
            <div class="bg-[#F2EFE6] px-6 py-4 flex justify-between items-center border-t border-[#E8DCC4]">
              <button 
                (click)="prevPage()" 
                [disabled]="currentPreviewPage() === 0"
                class="px-4 py-2 border border-[#D8C7A5] rounded-md text-gray-700 bg-[#F9F6EE] hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-colors"
              >
                &larr; Previous Page
              </button>
              
              <span class="font-serif text-gray-500 text-sm">
                Page {{ currentPreviewPage() + 1 }} of {{ b.previewPages.length }}
              </span>
              
              <button 
                (click)="nextPage(b.previewPages.length)" 
                [disabled]="currentPreviewPage() === b.previewPages.length - 1"
                class="px-4 py-2 border border-[#D8C7A5] rounded-md text-gray-700 bg-[#F9F6EE] hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-colors"
              >
                Next Page &rarr;
              </button>
            </div>
          </div>
        }

        <!-- Success Message Toast -->
        @if (showSuccessMessage()) {
          <div class="fixed bottom-4 right-4 bg-green-50 border-l-4 border-green-400 p-4 rounded shadow-lg transition-opacity animate-fade-in-up z-50">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-green-700 font-medium">Successfully borrowed! Check your dashboard.</p>
              </div>
            </div>
          </div>
        }
      } @else {
        <div class="text-center py-20">
          <p class="text-xl text-gray-500">Book not found.</p>
          <a routerLink="/" class="mt-4 text-primary-600 hover:text-primary-800 font-medium block">Return to Catalog</a>
        </div>
      }
    </main>
  `,
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translate3d(0, 20px, 0); }
      to { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.4s ease-out forwards;
    }
  `]
})
export class BookDetailsComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  library = inject(LibraryService);
  auth = inject(AuthService);

  bookId = computed(() => this.route.snapshot.paramMap.get('id'));
  book = computed(() => this.bookId() ? this.library.getBookById(this.bookId()!) : undefined);
  
  isProcessing = signal(false);
  showSuccessMessage = signal(false);
  
  // Preview Reader State
  showPreview = signal(false);
  currentPreviewPage = signal(0);

  togglePreview() {
    this.showPreview.set(!this.showPreview());
    this.currentPreviewPage.set(0); // Reset to page 1
  }

  nextPage(maxPages: number) {
    if (this.currentPreviewPage() < maxPages - 1) {
      this.currentPreviewPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPreviewPage() > 0) {
      this.currentPreviewPage.update(p => p - 1);
    }
  }

  borrowBook() {
    const user = this.auth.currentUser();
    const currentBook = this.book();
    
    if (user && currentBook && currentBook.copiesAvailable > 0) {
      this.isProcessing.set(true);
      
      // Simulate network request
      setTimeout(() => {
        this.library.borrowBook(user.id, currentBook.id);
        this.isProcessing.set(false);
        this.showSuccessMessage.set(true);
        
        setTimeout(() => {
          this.showSuccessMessage.set(false);
        }, 3000);
      }, 600);
    }
  }
}