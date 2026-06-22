import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './demo.html',
  styleUrls: ['./demo.css'],
})
export class Demo {
  mascotasDemo = [
    {
      nombre: 'Luna',
      especie: '🐶',
      vacuna: 'Antirrábica',
      proximaDosis: '2026-08-15',
      estado: '🟢 Al día',
    },
    {
      nombre: 'Milo',
      especie: '🐱',
      vacuna: 'Triple Felina',
      proximaDosis: '2026-07-01',
      estado: '🟡 Próxima',
    },
    {
      nombre: 'Rocky',
      especie: '🐶',
      vacuna: 'Séxtuple',
      proximaDosis: '2026-05-20',
      estado: '🔴 Vencida',
    },
  ];
}
