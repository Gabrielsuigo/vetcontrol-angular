import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../../core/services/mascota.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.html',
  styleUrls: ['./historial.css'],
})
export class Historial {
  mascotas: any;
  constructor(public mascotaService: MascotaService) {}
}
