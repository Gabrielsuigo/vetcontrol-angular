import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EmpresaService } from '../../core/services/empresa.service';

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

  empresaService = inject(EmpresaService);

  snackBar = inject(MatSnackBar);

  router = inject(Router);

  nombre = '';

  email = '';

  password = '';

  confirmarPassword = '';

  nombreComercial = '';

  razonSocial = '';

  pais = '';

  direccion = '';

  telefono = '';

  error = '';

  registrarse() {
    if (
      !this.nombre ||
      !this.email ||
      !this.password ||
      !this.confirmarPassword ||
      !this.nombreComercial ||
      !this.razonSocial ||
      !this.pais ||
      !this.direccion ||
      !this.telefono
    ) {
      this.error = 'Completá todos los campos';

      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.error = 'Las contraseñas no coinciden';

      return;
    }

    this.empresaService.guardarEmpresa({
      nombreComercial: this.nombreComercial,
      razonSocial: this.razonSocial,
      pais: this.pais,
      direccion: this.direccion,
      telefono: this.telefono,
    });

    const registrado = this.authService.registrar({
      nombre: this.nombre,
      email: this.email,
      password: this.password,
      rol: 'Administrador',
      fechaRegistro: new Date().toLocaleDateString('es-AR'),
    });

    if (!registrado) {
      this.error = 'Ya existe un usuario con ese email';

      return;
    }

    this.error = '';

    this.snackBar.open('Veterinaria creada correctamente 👋 Ahora iniciá sesión', 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1800);
  }
}
