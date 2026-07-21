import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MascotaService } from '../../core/services/mascota.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

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
  dialog = inject(MatDialog);
  mascotaId = 0;

  nombre = '';

  fecha = new Date().toISOString().split('T')[0];
  frecuencia = 12; // meses (1 año por defecto)
  mensajeExito = '';
  modoEdicion = false;
  mascotaEditandoId = 0;
  vacunaEditandoIndex = -1;

  get proximaDosisCalculada(): string {
    const d = new Date(this.fecha);

    d.setMonth(d.getMonth() + this.frecuencia);

    return d.toISOString().split('T')[0];
  }
  obtenerEstado(proximaDosis?: string): string {
    if (!proximaDosis) return '🟢 Al día';

    const hoy = new Date();
    const proxima = new Date(proximaDosis);

    hoy.setHours(0, 0, 0, 0);
    proxima.setHours(0, 0, 0, 0);

    const diferenciaDias = (proxima.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);

    if (diferenciaDias < 0) {
      return '🔴 Vencida';
    }

    if (diferenciaDias <= 30) {
      return '🟡 Próxima';
    }

    return '🟢 Al día';
  }

  registrarVacuna() {
    if (!this.mascotaId || !this.nombre.trim()) return;

    if (this.modoEdicion) {
      this.mascotaService.editarVacuna(
        this.mascotaEditandoId,
        this.vacunaEditandoIndex,
        {
          nombre: this.nombre,
          fecha: this.fecha,
        },
        this.frecuencia,
      );

      this.mensajeExito = '✏️ Vacuna editada correctamente';

      this.modoEdicion = false;
      this.mascotaEditandoId = 0;
      this.vacunaEditandoIndex = -1;
      this.mascotaId = 0;
    } else {
      this.mascotaService.agregarVacuna(
        this.mascotaId,
        {
          nombre: this.nombre,
          fecha: this.fecha,
        },
        this.frecuencia,
      );

      this.mensajeExito = '✅ Vacuna registrada correctamente';
    }

    this.nombre = '';
    this.fecha = new Date().toISOString().split('T')[0];

    setTimeout(() => {
      this.mensajeExito = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  confirmarGuardarVacuna() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '430px',
      disableClose: true,
      data: {
        titulo: this.modoEdicion ? 'Guardar cambios' : 'Registrar vacuna',
        subtitulo: 'Vacunación',
        mensaje: this.modoEdicion
          ? '¿Deseás guardar los cambios realizados en esta vacuna?'
          : '¿Deseás registrar esta vacuna?',
        tipo: 'save',
        textoAceptar: this.modoEdicion ? 'Guardar' : 'Registrar',
        textoCancelar: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.registrarVacuna();
      }
    });
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
  confirmarEliminarVacuna(mascotaId: number, index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '430px',
      disableClose: true,
      data: {
        titulo: 'Eliminar vacuna',
        subtitulo: 'Historial de vacunación',
        mensaje:
          '¿Estás seguro de que querés eliminar esta vacuna? Esta acción no se puede deshacer.',
        tipo: 'delete',
        textoAceptar: 'Eliminar',
        textoCancelar: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.eliminarVacuna(mascotaId, index);
      }
    });
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
    this.frecuencia = vacuna.frecuenciaMeses ?? 12;

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
