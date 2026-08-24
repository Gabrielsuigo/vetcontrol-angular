import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';
import { EmpresaService } from '../../core/services/empresa.service';

import { AuthService } from '../../core/auth/services/auth.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register',

  standalone: true,

  imports: [CommonModule, FormsModule, RouterModule, MatFormFieldModule, MatSelectModule],

  templateUrl: './register.html',

  styleUrl: './register.css',
})
export class Register {
  authService = inject(AuthService);

  empresaService = inject(EmpresaService);

  notification = inject(NotificationService);

  router = inject(Router);

  nombre = '';

  email = '';

  password = '';

  confirmarPassword = '';

  nombreComercial = '';

  razonSocial = '';

  pais = '';

  paises = [
    'Argentina',
    'Bolivia',
    'Brasil',
    'Chile',
    'Colombia',
    'Ecuador',
    'Paraguay',
    'Perú',
    'Uruguay',
    'Venezuela',
    'México',
    'Estados Unidos',
    'Canadá',
    'España',
    'Italia',
    'Francia',
    'Alemania',
    'Reino Unido',
    'Australia',
    'Japón',
  ];

  direccion = '';

  telefono = '';

  foto = 'assets/img/avatar-default.png';

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
      this.notification.warning('Completá todos los campos');
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.notification.error('Las contraseñas no coinciden');

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
      fotoPerfil: this.foto,
    });

    if (!registrado) {
      this.notification.error('Ya existe un usuario con ese email');
      return;
    }

    this.notification.success('Cuenta creada correctamente. Ahora iniciá sesión.');

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1800);
  }
}
