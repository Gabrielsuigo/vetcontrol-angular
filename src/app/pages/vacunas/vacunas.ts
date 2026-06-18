import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MascotaService } from '../../core/services/mascota.service';

@Component({
  selector: 'app-vacunas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vacunas.html',
  styleUrls: ['./vacunas.css'],
})
export class Vacunas {
  mascotaService = inject(MascotaService);
  cdr = inject(ChangeDetectorRef);
  mascotaId = 0;

  nombre = '';

  fecha = new Date().toISOString().split('T')[0];
  mensajeExito = '';
  modoEdicion = false;
  mascotaEditandoId = 0;
  vacunaEditandoIndex = -1;
  get proximaDosisCalculada(): string {
    const d = new Date(this.fecha);

    d.setMonth(d.getMonth() + 12);

    return d.toISOString().split('T')[0];
  }

  registrarVacuna() {
    if (!this.mascotaId || !this.nombre.trim()) return;

    if (this.modoEdicion) {
      this.mascotaService.editarVacuna(this.mascotaEditandoId, this.vacunaEditandoIndex, {
        nombre: this.nombre,
        fecha: this.fecha,
      });

      this.mensajeExito = '✏️ Vacuna editada correctamente';

      this.modoEdicion = false;
      this.mascotaEditandoId = 0;
      this.vacunaEditandoIndex = -1;
      this.mascotaId = 0;
    } else {
      this.mascotaService.agregarVacuna(this.mascotaId, {
        nombre: this.nombre,
        fecha: this.fecha,
      });

      this.mensajeExito = '✅ Vacuna registrada correctamente';
    }

    this.nombre = '';
    this.fecha = new Date().toISOString().split('T')[0];

    setTimeout(() => {
      this.mensajeExito = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  eliminarVacuna(mascotaId: number, index: number) {
    const confirmar = confirm('¿Eliminar esta vacuna?');

    if (!confirmar) return;

    this.mascotaService.eliminarVacuna(mascotaId, index);

    this.mensajeExito = '🗑 Vacuna eliminada correctamente';

    setTimeout(() => {
      this.mensajeExito = '';
      this.cdr.detectChanges();
    }, 3000);
  }
  editarVacuna(mascotaId: number, index: number) {
    const mascota = this.mascotaService.mascotasUsuario().find((m) => m.id === mascotaId);

    if (!mascota) return;

    const vacuna = mascota.vacunas[index];

    this.modoEdicion = true;
    this.mascotaEditandoId = mascotaId;
    this.vacunaEditandoIndex = index;

    this.mascotaId = mascotaId;
    this.nombre = vacuna.nombre;
    this.fecha = vacuna.fecha;

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  cancelarEdicion() {
    this.modoEdicion = false;
    this.mascotaEditandoId = 0;
    this.vacunaEditandoIndex = -1;

    this.mascotaId = 0;
    this.nombre = '';
    this.fecha = new Date().toISOString().split('T')[0];
  }
}
