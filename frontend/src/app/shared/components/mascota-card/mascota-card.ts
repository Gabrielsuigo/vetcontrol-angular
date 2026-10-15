import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Mascota } from '../../../models/mascota.model';

@Component({
  selector: 'app-mascota-card',

  standalone: true,

  imports: [CommonModule, MatIconModule, RouterModule],

  templateUrl: './mascota-card.html',

  styleUrl: './mascota-card.css',
})
export class MascotaCardComponent {
  @Input() mascota!: Mascota;
}
