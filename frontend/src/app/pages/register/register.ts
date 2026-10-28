import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';
import { EmpresaService } from '../../core/services/empresa.service';
import { AuthApiService } from '../../core/auth/services/auth-api.service';

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
  private authApi = inject(AuthApiService);

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

  foto = '/img/default-user.png';
  mostrarAvatares = false;

  avatares = [
    '/img/default-user.png',
    '/img/avatar-1.png',
    '/img/avatar-2.png',
    '/img/avatar-3.png',
    '/img/avatar-4.png',
    '/img/avatar-5.png',
    '/img/avatar-6.png',
    '/img/avatar-7.png',
  ];

  cargando = false;

  registrarse(): void {
    if (
      !this.nombre.trim() ||
      !this.email.trim() ||
      !this.password ||
      !this.confirmarPassword ||
      !this.nombreComercial.trim() ||
      !this.razonSocial.trim() ||
      !this.pais ||
      !this.direccion.trim() ||
      !this.telefono.trim()
    ) {
      this.notification.warning('Completá todos los campos');
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.notification.error('Las contraseñas no coinciden');
      return;
    }

    if (this.password.length < 8) {
      this.notification.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (this.cargando) {
      return;
    }

    this.cargando = true;

    this.authApi
      .registrar({
        nombre: this.nombre.trim(),
        email: this.email.trim().toLowerCase(),
        password: this.password,
        nombreComercial: this.nombreComercial.trim(),
        razonSocial: this.razonSocial.trim(),
        pais: this.pais,
        direccion: this.direccion.trim(),
        telefono: this.telefono.trim(),
      })
      .subscribe({
        next: (respuesta) => {
          this.empresaService.guardarEmpresa({
            nombreComercial: this.nombreComercial.trim(),
            razonSocial: this.razonSocial.trim(),
            pais: this.pais,
            direccion: this.direccion.trim(),
            telefono: this.telefono.trim(),
          });

          this.notification.success('Cuenta creada correctamente. Ahora iniciá sesión.');

          this.cargando = false;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1800);
        },
        error: (error) => {
          const mensaje =
            error.status === 409
              ? 'Ya existe un usuario con ese email'
              : error.status === 0
                ? 'No se pudo conectar con el servidor'
                : error.error?.mensaje || 'No se pudo completar el registro';

          this.notification.error(mensaje);
          this.cargando = false;
        },
      });
  }
}
