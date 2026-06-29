import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { MascotaService } from '../../core/services/mascota.service';
import { TurnoService } from '../../core/services/turno.service';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './turnos.html',
  styleUrl: './turnos.css',
})
export class Turnos {
  mascotaService = inject(MascotaService);

  turnoService = inject(TurnoService);

  mascotas = this.mascotaService.mascotasUsuario;

  turnos = this.turnoService.turnosUsuario;

  mascotaId = 0;

  fecha = '';

  hora = '';

  motivo = '';

  totalTurnos = computed(() => this.turnos().length);

  turnosPendientes = computed(() => this.turnos().filter((t) => t.estado === 'Pendiente').length);

  turnosCompletados = computed(() => this.turnos().filter((t) => t.estado === 'Completado').length);
  guardarTurno() {
    if (!this.mascotaId || !this.fecha || !this.hora || !this.motivo) {
      return;
    }

    const mascota = this.mascotas().find((m) => m.id === Number(this.mascotaId));

    if (!mascota) return;

    this.turnoService.agregar({
      mascotaId: mascota.id,
      mascotaNombre: mascota.nombre,

      usuarioEmail: JSON.parse(localStorage.getItem('sesion') || '{}').email,

      fecha: this.fecha,
      hora: this.hora,
      motivo: this.motivo,
      estado: 'Pendiente',
    });

    this.mascotaId = 0;
    this.fecha = '';
    this.hora = '';
    this.motivo = '';
  }

  completar(id: number) {
    this.turnoService.completar(id);
  }

  eliminar(id: number) {
    this.turnoService.eliminar(id);
  }
  fechaActual = new Date().toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
