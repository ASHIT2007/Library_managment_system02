import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen flex flex-col font-sans">
      <app-navbar></app-navbar>
      
      <!-- Main Content Area -->
      <div class="flex-grow w-full">
        <router-outlet></router-outlet>
      </div>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 mt-auto">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p class="text-center text-sm text-gray-500">
            &copy; 2024 LibraFlow Management System. Built for educational demonstration.
          </p>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {
}
