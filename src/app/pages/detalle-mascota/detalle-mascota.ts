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
  totalVacunas = computed(() => this.mascota()?.vacunas.length ?? 0);

  totalConsultas = computed(() => this.mascota()?.consultas.length ?? 0);

  totalTurnos = computed(() => this.turnosMascota().length);

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
