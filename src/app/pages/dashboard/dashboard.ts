import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MascotaCardComponent } from '../../shared/components/mascota-card/mascota-card';

import { MascotaService } from '../../core/services/mascota.service';

@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [MatCardModule, MatButtonModule, RouterModule, MatIconModule, MascotaCardComponent],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.css',
})
export class Dashboard {
  mascotaService = inject(MascotaService);

  mascotas = this.mascotaService.mascotasUsuario;
  totalMascotas = computed(() => this.mascotas().length);

  totalVacunas = computed(() =>
    this.mascotas().reduce((acc, mascota) => acc + mascota.vacunas.length, 0),
  );

  totalConsultas = computed(() =>
    this.mascotas().reduce((acc, mascota) => acc + mascota.consultas.length, 0),
  );

  mascotasRecientes = computed(() => [...this.mascotas()].reverse().slice(0, 3));
}
