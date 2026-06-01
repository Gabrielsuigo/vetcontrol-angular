import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-register',

  standalone: true,

  imports: [CommonModule, FormsModule, RouterModule],

  templateUrl: './register.html',

  styleUrl: './register.css',
})
export class Register {
  authService = inject(AuthService);

  snackBar = inject(MatSnackBar);

  router = inject(Router);

  nombre = '';

  email = '';

  password = '';

  error = '';

  registrarse() {
    if (!this.nombre || !this.email || !this.password) {
      this.error = 'Completá todos los campos';

      return;
    }

    const registrado = this.authService.registrar({
      nombre: this.nombre,
      email: this.email,
      password: this.password,
    });

    if (!registrado) {
      this.error = 'Ya existe un usuario con ese email';

      return;
    }

    this.error = '';

    this.snackBar.open('Cuenta creada correctamente 👋 Ahora iniciá sesión', 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1800);
  }
}
