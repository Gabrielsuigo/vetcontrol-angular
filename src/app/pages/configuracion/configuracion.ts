import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/auth/services/auth.service';
import { EmpresaService } from '../../core/services/empresa.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion {
  authService = inject(AuthService);
  empresaService = inject(EmpresaService);
  notification = inject(NotificationService);

  // =========================
  // CUENTA
  // =========================

  nombre = '';
  email = '';
  rol = '';

  // =========================
  // SEGURIDAD
  // =========================

  passwordActual = '';
  passwordNueva = '';
  passwordConfirmacion = '';

  // =========================
  // VETERINARIA
  // =========================

  nombreComercial = '';
  razonSocial = '';
  pais = '';
  direccion = '';
  telefono = '';

  constructor() {
    this.cargarDatos();
  }

  private cargarDatos() {
    const usuario = this.authService.usuarioActual();
    const empresa = this.empresaService.empresa();

    if (usuario) {
      this.nombre = usuario.nombre;
      this.email = usuario.email;
      this.rol = usuario.rol;
    }

    if (empresa) {
      this.nombreComercial = empresa.nombreComercial;
      this.razonSocial = empresa.razonSocial;
      this.pais = empresa.pais;
      this.direccion = empresa.direccion;
      this.telefono = empresa.telefono;
    }
  }

  // =========================
  // GUARDAR CUENTA
  // =========================

  guardarCuenta() {
    if (!this.nombre.trim() || !this.email.trim()) {
      this.notification.warning('Completá el nombre y el email');
      return;
    }

    const usuario = this.authService.usuarioActual();

    if (!usuario) {
      this.notification.error('No hay una sesión activa');
      return;
    }

    const emailActual = usuario.email;

    const emailExiste = this.authService
      .usuarios()
      .some((u) => u.email === this.email && u.email !== emailActual);

    if (emailExiste) {
      this.notification.error('Ya existe un usuario con ese email');
      return;
    }

    this.authService.actualizarUsuario({
      nombre: this.nombre.trim(),
      email: this.email.trim(),
    });

    this.notification.success('Datos de la cuenta actualizados');
  }

  // =========================
  // CAMBIAR CONTRASEÑA
  // =========================

  cambiarPassword() {
    if (!this.passwordActual || !this.passwordNueva || !this.passwordConfirmacion) {
      this.notification.warning('Completá todos los campos de contraseña');
      return;
    }

    if (this.passwordNueva !== this.passwordConfirmacion) {
      this.notification.error('Las nuevas contraseñas no coinciden');
      return;
    }

    if (this.passwordNueva.length < 6) {
      this.notification.warning('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    const cambio = this.authService.cambiarPassword(this.passwordActual, this.passwordNueva);

    if (!cambio) {
      this.notification.error('La contraseña actual es incorrecta');
      return;
    }

    this.passwordActual = '';
    this.passwordNueva = '';
    this.passwordConfirmacion = '';

    this.notification.success('Contraseña actualizada correctamente');
  }

  // =========================
  // GUARDAR VETERINARIA
  // =========================

  guardarVeterinaria() {
    if (
      !this.nombreComercial.trim() ||
      !this.razonSocial.trim() ||
      !this.pais.trim() ||
      !this.direccion.trim() ||
      !this.telefono.trim()
    ) {
      this.notification.warning('Completá todos los datos de la veterinaria');
      return;
    }

    this.empresaService.guardarEmpresa({
      nombreComercial: this.nombreComercial.trim(),
      razonSocial: this.razonSocial.trim(),
      pais: this.pais.trim(),
      direccion: this.direccion.trim(),
      telefono: this.telefono.trim(),
    });

    this.notification.success('Datos de la veterinaria actualizados');
  }
}
