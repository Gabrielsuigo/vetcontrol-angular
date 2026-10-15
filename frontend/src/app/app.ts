import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';

import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from './core/auth/services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NotificationService } from './shared/services/notification.service';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog';

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
  notification = inject(NotificationService);
  dialog = inject(MatDialog);
  esPaginaPublica(): boolean {
    return (
      this.router.url === '/' ||
      this.router.url === '/login' ||
      this.router.url === '/register' ||
      this.router.url === '/demo'
    );
  }

  logout() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '430px',
      disableClose: true,
      data: {
        titulo: 'Cerrar sesión',
        subtitulo: 'VetControl',
        mensaje: '¿Deseás cerrar la sesión actual?',
        tipo: 'logout',
        textoAceptar: 'Cerrar sesión',
        textoCancelar: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (!resultado) return;

      this.authService.logout();

      this.notification.success('Sesión cerrada correctamente');

      this.router.navigate(['/']);
    });
  }

  toggleSidebar() {
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  cerrarSidebar() {
    this.sidebarAbierto = false;
  }
}
