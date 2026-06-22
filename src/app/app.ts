import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';

import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from './core/auth/services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',

  standalone: true,

  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],

  templateUrl: './app.html',

  styleUrl: './app.css',
})
export class App {
  sidebarAbierto = false;
  authService = inject(AuthService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  esPaginaPublica(): boolean {
    return (
      this.router.url === '/' ||
      this.router.url === '/login' ||
      this.router.url === '/register' ||
      this.router.url === '/demo'
    );
  }

  logout() {
    this.authService.logout();
    this.snackBar.open('✓ Sesión cerrada correctamente', '', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['logout-snackbar'],
    });
    this.router.navigate(['/']);
  }
  toggleSidebar() {
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  cerrarSidebar() {
    this.sidebarAbierto = false;
  }
}
