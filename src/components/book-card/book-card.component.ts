import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '../../models/types';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  template: `
    <div [routerLink]="['/book', book().id]" class="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer h-full">
      <div class="relative aspect-[2/3] w-full overflow-hidden bg-gray-100">
        <!-- Using standard img as NgOptimizedImage requires specific loader config often not available in strict environments without setup -->
        <img [src]="book().coverUrl" [alt]="book().title" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        
        <div class="absolute top-2 right-2">
          @if (book().copiesAvailable > 0) {
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 backdrop-blur-sm bg-opacity-90 shadow-sm">
              Available
            </span>
          } @else {
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 backdrop-blur-sm bg-opacity-90 shadow-sm">
              Borrowed out
            </span>
          }
        </div>
      </div>
      <div class="p-4 flex-grow flex flex-col justify-between">
        <div>
          <p class="text-xs font-medium text-primary-600 mb-1 uppercase tracking-wider">{{ book().category }}</p>
          <h3 class="text-lg font-bold text-gray-900 line-clamp-2 leading-tight mb-1 group-hover:text-primary-600 transition-colors">{{ book().title }}</h3>
          <p class="text-sm text-gray-600 mb-3">{{ book().author }}</p>
        </div>
        <div class="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
          <span class="text-xs text-gray-500">{{ book().publicationYear }}</span>
          <span class="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
            {{ book().copiesAvailable }}/{{ book().copiesTotal }} left
          </span>
        </div>
      </div>
    </div>
  `
})
export class BookCardComponent {
  book = input.required<Book>();
}
