import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  snackBar = inject(MatSnackBar);

  email = '';

  password = '';

  error = '';

  iniciarSesion() {
    if (!this.email || !this.password) {
      this.snackBar.open('Completá todos los campos', 'Cerrar', {
        duration: 3000,
      });

      return;
    }

    const loginCorrecto = this.authService.login(this.email, this.password);

    if (!loginCorrecto) {
      this.snackBar.open('Email o contraseña incorrectos', 'Cerrar', {
        duration: 3000,
      });

      return;
    }

    this.snackBar.open('Bienvenido al sistema', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['login-snackbar'],
    });

    this.router.navigate(['/dashboard']);
  }
}
