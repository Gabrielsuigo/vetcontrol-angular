import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';

import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-login',

  standalone: true,

  imports: [CommonModule, FormsModule, RouterModule],

  templateUrl: './login.html',

  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);

  router = inject(Router);
  notification = inject(NotificationService);
  email = '';

  password = '';

  iniciarSesion() {
    if (!this.email || !this.password) {
      this.notification.warning('Completá todos los campos');
      return;
    }

    const loginCorrecto = this.authService.login(this.email, this.password);

    if (!loginCorrecto) {
      this.notification.error('Email o contraseña incorrectos');
      return;
    }

    this.notification.success('Bienvenido al sistema');

    this.router.navigate(['/dashboard']);
  }
}
