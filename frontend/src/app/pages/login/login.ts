import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';
import { AuthService } from '../../core/auth/services/auth.service';
import { MascotaService } from '../../core/services/mascota.service';
import { EmpresaService } from '../../core/services/empresa.service';

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
  mascotaService = inject(MascotaService);
  empresaService = inject(EmpresaService);

  email = '';
  password = '';
  cargando = false;

  iniciarSesion(): void {
    if (!this.email.trim() || !this.password) {
      this.notification.warning('Completá todos los campos');
      return;
    }

    if (this.cargando) return;

    this.cargando = true;

    this.authService.iniciarSesion(this.email, this.password).subscribe({
      next: (respuesta) => {
        if (!respuesta.token || !respuesta.usuario) {
          this.notification.error('El servidor no devolvió los datos de la sesión');
          this.cargando = false;
          return;
        }

        this.authService.guardarSesion(respuesta.usuario, respuesta.token);

        // Cargar los datos correspondientes a la veterinaria autenticada
        this.empresaService.cargarDesdeBackend();

        // Cargar las mascotas correspondientes a la veterinaria autenticada
        this.mascotaService.cargarDesdeBackend();

        this.notification.success('Bienvenido al sistema');
        this.router.navigate(['/dashboard']);

        this.cargando = false;
      },
      error: (error) => {
        const mensaje =
          error.status === 401
            ? 'Email o contraseña incorrectos'
            : error.status === 0
              ? 'No se pudo conectar con el servidor'
              : error.error?.mensaje || 'No se pudo iniciar sesión';

        this.notification.error(mensaje);
        this.cargando = false;
      },
    });
  }
}
