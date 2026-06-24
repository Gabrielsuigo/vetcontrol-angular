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
      especie: 'Perro',
      raza: 'Golden Retriever',
      vacuna: 'Antirrábica',
      proximaDosis: '15/08/2026',
      estado: '🟢 Al día',
    },
    {
      nombre: 'Milo',
      especie: 'Gato',
      raza: 'Siamés',
      vacuna: 'Triple Felina',
      proximaDosis: '01/07/2026',
      estado: '🟡 Próxima',
    },
    {
      nombre: 'Rocky',
      especie: 'Perro',
      raza: 'Labrador',
      vacuna: 'Séxtuple',
      proximaDosis: '20/05/2026',
      estado: '🔴 Vencida',
    },
  ];

  turnosDemo = [
    {
      mascota: 'Luna',
      fecha: '25/06/2026',
      motivo: 'Control anual',
    },
    {
      mascota: 'Milo',
      fecha: '27/06/2026',
      motivo: 'Refuerzo de vacuna',
    },
  ];

  consultasDemo = [
    {
      mascota: 'Rocky',
      fecha: '12/06/2026',
      motivo: 'Control clínico',
    },
    {
      mascota: 'Luna',
      fecha: '05/06/2026',
      motivo: 'Vacunación',
    },
  ];
}
