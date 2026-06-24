import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MascotaCardComponent } from '../../shared/components/mascota-card/mascota-card';

import { MascotaService } from '../../core/services/mascota.service';
import { TurnoService } from '../../core/services/turno.service';

@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [MatCardModule, MatButtonModule, RouterModule, MatIconModule],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.css',
})
export class Dashboard {
  mascotaService = inject(MascotaService);
  turnoService = inject(TurnoService);

  mascotas = this.mascotaService.mascotasUsuario;
  turnos = this.turnoService.turnosUsuario;
  totalMascotas = computed(() => this.mascotas().length);

  totalVacunas = computed(() =>
    this.mascotas().reduce((acc, mascota) => acc + mascota.vacunas.length, 0),
  );

  totalConsultas = computed(() =>
    this.mascotas().reduce((acc, mascota) => acc + mascota.consultas.length, 0),
  );

  totalTurnos = computed(() => this.turnos().length);

  proximosTurnos = computed(() =>
    [...this.turnos()]
      .sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.hora}`).getTime();
        const fechaB = new Date(`${b.fecha}T${b.hora}`).getTime();

        return fechaA - fechaB;
      })
      .slice(0, 3),
  );

  vacunasProximas = computed(() => {
    return this.mascotas()
      .flatMap((mascota) =>
        mascota.vacunas.map((vacuna) => ({
          mascota: mascota.nombre,
          nombre: vacuna.nombre,
          proximaDosis: vacuna.proximaDosis,
        })),
      )
      .filter((v) => v.proximaDosis)
      .sort((a, b) => a.proximaDosis!.localeCompare(b.proximaDosis!))
      .slice(0, 5);
  });

  mascotasRecientes = computed(() => [...this.mascotas()].reverse().slice(0, 3));
}
