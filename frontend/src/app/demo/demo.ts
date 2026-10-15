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
      estado: 'Al día',
      tipoEstado: 'vigente',
    },
    {
      nombre: 'Milo',
      especie: 'Gato',
      raza: 'Siamés',
      vacuna: 'Triple Felina',
      proximaDosis: '10/08/2026',
      estado: 'Próxima',
      tipoEstado: 'proxima',
    },
    {
      nombre: 'Rocky',
      especie: 'Perro',
      raza: 'Labrador',
      vacuna: 'Séxtuple',
      proximaDosis: '20/05/2026',
      estado: 'Vencida',
      tipoEstado: 'vencida',
    },
  ];

  turnosDemo = [
    {
      mascota: 'Luna',
      fecha: '25/08/2026',
      hora: '10:30',
      motivo: 'Control anual',
    },
    {
      mascota: 'Milo',
      fecha: '27/08/2026',
      hora: '15:00',
      motivo: 'Refuerzo de vacuna',
    },
  ];

  consultasDemo = [
    {
      mascota: 'Rocky',
      fecha: '02/08/2026',
      motivo: 'Control clínico',
      diagnostico: 'Control general',
    },
    {
      mascota: 'Luna',
      fecha: '30/07/2026',
      motivo: 'Vacunación',
      diagnostico: 'Paciente en buen estado',
    },
  ];

  get vacunasProximas(): number {
    return this.mascotasDemo.filter((mascota) => mascota.tipoEstado === 'proxima').length;
  }
}
