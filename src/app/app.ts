import { Component, inject, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from './core/auth/services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',

  standalone: true,

  imports: [RouterOutlet, RouterModule, CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],

  templateUrl: './app.html',

  styleUrl: './app.css',
})
export class App {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
