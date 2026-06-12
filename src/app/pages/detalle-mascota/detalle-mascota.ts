import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { MascotaService } from '../../core/services/mascota.service';
import { MatIconModule } from '@angular/material/icon';
import { TurnoService } from '../../core/services/turno.service';

@Component({
  selector: 'app-detalle-mascota',

  standalone: true,

  imports: [MatIconModule],

  templateUrl: './detalle-mascota.html',

  styleUrl: './detalle-mascota.css',
})
export class DetalleMascota {
  route = inject(ActivatedRoute);

  mascotaService = inject(MascotaService);

  turnoService = inject(TurnoService);

  id = Number(this.route.snapshot.paramMap.get('id'));

  mascota = computed(() => this.mascotaService.mascotas().find((m) => m.id === this.id));

  turnosMascota = computed(() =>
    this.turnoService
      .turnosUsuario()
      .filter((t) => t.mascotaId === this.id)
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()),
  );

  proximoTurno() {
    const pendientes = this.turnosOrdenados().filter((t) => t.estado === 'Pendiente');

    return pendientes.length > 0 ? pendientes[0] : null;
  }
  totalVacunas = computed(() => this.mascota()?.vacunas.length ?? 0);

  totalConsultas = computed(() => this.mascota()?.consultas.length ?? 0);

  totalTurnos = computed(() => this.turnosMascota().length);

  estadoSanitario = computed(() => {
    const vacunas = this.mascota()?.vacunas ?? [];

    if (!vacunas.length) {
      return 'sin-vacunas';
    }

    const hoy = new Date();

    const tieneVencida = vacunas.some((vacuna) => {
      if (!vacuna.proximaDosis) {
        return false;
      }

      return new Date(vacuna.proximaDosis) < hoy;
    });

    if (tieneVencida) {
      return 'pendiente';
    }

    return 'ok';
  });

  mensajeSanitario = computed(() => {
    const vacunas = this.mascota()?.vacunas ?? [];

    if (!vacunas.length) {
      return 'Registrar primera vacuna';
    }

    const hoy = new Date();

    const vencidas = vacunas.filter(
      (vacuna) => vacuna.proximaDosis && new Date(vacuna.proximaDosis) < hoy,
    );

    if (vencidas.length) {
      return `${vencidas.length} vacuna(s) requieren atención`;
    }

    return `${vacunas.length} vacuna(s) registrada(s)`;
  });

  proximaVacuna = computed(() => {
    const vacunas = this.mascota()?.vacunas ?? [];

    const vacunasConProxima = vacunas.filter((vacuna) => vacuna.proximaDosis);

    if (!vacunasConProxima.length) {
      return null;
    }

    return vacunasConProxima.sort(
      (a, b) => new Date(a.proximaDosis!).getTime() - new Date(b.proximaDosis!).getTime(),
    )[0];
  });

  diasParaProximaVacuna = computed(() => {
    const vacuna = this.proximaVacuna();

    if (!vacuna?.proximaDosis) {
      return null;
    }

    const hoy = new Date();

    const fecha = new Date(vacuna.proximaDosis);

    const diferencia = fecha.getTime() - hoy.getTime();

    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  });

  vacunasOrdenadas = computed(() =>
    [...(this.mascota()?.vacunas ?? [])].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    ),
  );

  consultasOrdenadas = computed(() =>
    [...(this.mascota()?.consultas ?? [])].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    ),
  );

  turnosOrdenados = computed(() =>
    [...this.turnosMascota()].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    ),
  );

  ultimoPeso = computed(() => {
    const consultas = this.mascota()?.consultas ?? [];

    if (consultas.length === 0) return null;

    return consultas[consultas.length - 1].peso;
  });
}
