import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  authService = inject(AuthService);
  usuario = this.authService.usuarioActual;

  fotoPerfil = 'https://ui-avatars.com/api/?background=6366F1&color=fff&size=256&name=Gabriel';
}
