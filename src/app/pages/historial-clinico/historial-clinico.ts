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

  consultas = computed(() => {
    return this.mascotaSeleccionada()?.consultas ?? [];
  });

  vacunas = computed(() => {
    return this.mascotaSeleccionada()?.vacunas ?? [];
  });

  diagnosticos = computed(() => {
    return this.consultas().filter((consulta) => consulta.diagnostico?.trim());
  });

  notas = computed(() => {
    return this.consultas().filter((consulta) => consulta.notas?.trim());
  });

  timeline = computed(() => {
    const mascota = this.mascotaSeleccionada();

    if (!mascota) {
      return [];
    }

    const eventos: {
      tipo: string;
      fecha: string;
      titulo: string;
      detalle: string;
    }[] = [];

    // Fecha de registro
    eventos.push({
      tipo: 'registro',
      fecha: mascota.fechaRegistro,
      titulo: 'Mascota registrada',
      detalle: `${mascota.nombre} fue registrada en VetControl`,
    });

    // Consultas
    mascota.consultas.forEach((consulta) => {
      eventos.push({
        tipo: 'consulta',
        fecha: consulta.fecha,
        titulo: 'Consulta',
        detalle: consulta.motivo || 'Consulta veterinaria',
      });

      // Peso registrado durante la consulta
      if (consulta.peso && consulta.peso > 0) {
        eventos.push({
          tipo: 'peso',
          fecha: consulta.fecha,
          titulo: 'Peso registrado',
          detalle: `${consulta.peso} kg`,
        });
      }
    });

    // Vacunas
    mascota.vacunas.forEach((vacuna) => {
      eventos.push({
        tipo: 'vacuna',
        fecha: vacuna.fecha,
        titulo: 'Vacuna aplicada',
        detalle: vacuna.nombre,
      });
    });

    // Ordenar del más reciente al más antiguo
    return eventos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  });

  pesoActual = computed(() => {
    const mascota = this.mascotaSeleccionada();

    if (!mascota) return 0;

    if (mascota.consultas.length === 0) return 0;

    return mascota.consultas[mascota.consultas.length - 1].peso;
  });

  estadoSanitario = computed(() => {
    const mascota = this.mascotaSeleccionada();

    if (!mascota) return 'Sin datos';

    if (mascota.consultas.length === 0) return 'Sin consultas';

    return 'Al día';
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
