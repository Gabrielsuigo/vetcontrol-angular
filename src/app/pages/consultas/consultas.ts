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

  modoEdicion = false;

  mascotaEditandoId = 0;

  consultaEditandoIndex = -1;

  registrarConsulta() {
    if (!this.mascotaId) return;

    if (this.modoEdicion) {
      this.mascotaService.editarConsulta(this.mascotaEditandoId, this.consultaEditandoIndex, {
        motivo: this.motivo,
        diagnostico: this.diagnostico,
        peso: this.peso,
        fecha: this.fecha,
      });

      this.mensajeExito = '✏️ Consulta editada correctamente';

      this.modoEdicion = false;
      this.mascotaEditandoId = 0;
      this.consultaEditandoIndex = -1;
    } else {
      this.mascotaService.agregarConsulta(this.mascotaId, {
        motivo: this.motivo,
        diagnostico: this.diagnostico,
        peso: this.peso,
        fecha: this.fecha,
      });

      this.mensajeExito = '✅ Consulta registrada correctamente';
    }

    this.motivo = '';
    this.diagnostico = '';
    this.peso = 0;
    this.observaciones = '';
    this.fecha = new Date().toISOString().split('T')[0];

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
    const mascota = this.mascotaService.mascotasUsuario().find((m) => m.id === mascotaId);

    if (!mascota) return;

    const consulta = mascota.consultas[index];

    this.modoEdicion = true;
    this.mascotaEditandoId = mascotaId;
    this.consultaEditandoIndex = index;

    this.mascotaId = mascotaId;
    this.motivo = consulta.motivo;
    this.diagnostico = consulta.diagnostico;
    this.peso = consulta.peso;
    this.fecha = consulta.fecha;

    this.mensajeExito = '✏️ Editando consulta seleccionada';

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
