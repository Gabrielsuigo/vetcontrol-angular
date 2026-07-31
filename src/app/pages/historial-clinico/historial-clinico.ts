import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MascotaService } from '../../core/services/mascota.service';

@Component({
  selector: 'app-historial-clinico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-clinico.html',
  styleUrl: './historial-clinico.css',
})
export class HistorialClinicoComponent {
  mascotaService = inject(MascotaService);

  mascotas = this.mascotaService.mascotasUsuario;

  mascotaId = signal(0);

  pestaniaActiva = signal('resumen');

  cambiarPestania(nombre: string) {
    this.pestaniaActiva.set(nombre);
  }

  cambioMascota(valor: any) {
    this.mascotaId.set(Number(valor));
  }

  mascotaSeleccionada = computed(() => {
    return this.mascotas().find((m) => m.id === this.mascotaId());
  });

  ultimaConsulta = computed(() => {
    const mascota = this.mascotaSeleccionada();

    if (!mascota || mascota.consultas.length === 0) {
      return null;
    }

    return mascota.consultas[mascota.consultas.length - 1];
  });

  proximaVacuna = computed(() => {
    const mascota = this.mascotaSeleccionada();

    if (!mascota || mascota.vacunas.length === 0) {
      return null;
    }

    return mascota.vacunas[mascota.vacunas.length - 1];
  });
}
