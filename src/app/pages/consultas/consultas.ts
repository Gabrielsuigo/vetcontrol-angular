import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MascotaService } from '../../core/services/mascota.service';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultas.html',
  styleUrls: ['./consultas.css'],
})
export class Consultas {
  mascotaService = inject(MascotaService);

  mascotaId = 0;

  motivo = '';

  diagnostico = '';

  peso = 0;

  observaciones = '';

  fecha = new Date().toISOString().split('T')[0];

  mensajeExito = '';

  registrarConsulta() {
    if (!this.mascotaId) return;

    this.mascotaService.agregarConsulta(this.mascotaId, {
      motivo: this.motivo,
      diagnostico: this.diagnostico,
      peso: this.peso,
      fecha: this.fecha,
    });

    this.motivo = '';
    this.diagnostico = '';
    this.peso = 0;
    this.observaciones = '';
    this.mensajeExito = '✅ Consulta registrada correctamente';

    setTimeout(() => {
      this.mensajeExito = '';
    }, 3000);
  }
  eliminarConsulta(mascotaId: number, index: number) {
    const confirmar = confirm('¿Eliminar esta consulta?');

    if (!confirmar) return;

    this.mascotaService.eliminarConsulta(mascotaId, index);

    this.mensajeExito = '🗑 Consulta eliminada correctamente';

    setTimeout(() => {
      this.mensajeExito = '';
    }, 3000);
  }
  editarConsulta(mascotaId: number, index: number) {
    alert('La edición de consultas será el próximo paso 🚀');
  }
}
