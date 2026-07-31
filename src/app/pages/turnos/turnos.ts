import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { MascotaService } from '../../core/services/mascota.service';
import { TurnoService } from '../../core/services/turno.service';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './turnos.html',
  styleUrl: './turnos.css',
})
export class Turnos {
  mascotaService = inject(MascotaService);

  turnoService = inject(TurnoService);

  dialog = inject(MatDialog);

  notification = inject(NotificationService);

  mascotas = this.mascotaService.mascotasUsuario;

  turnos = this.turnoService.turnosUsuario;

  mascotaId = 0;

  fecha = '';

  hora = '';

  motivo = '';

  totalTurnos = computed(() => this.turnos().length);

  turnosPendientes = computed(() => this.turnos().filter((t) => t.estado === 'Pendiente').length);

  turnosCompletados = computed(() => this.turnos().filter((t) => t.estado === 'Completado').length);

  guardarTurno() {
    if (!this.mascotaId || !this.fecha || !this.hora || !this.motivo) {
      this.notification.warning('Completá todos los campos');
      return;
    }

    const mascota = this.mascotas().find((m) => m.id === Number(this.mascotaId));

    if (!mascota) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '430px',
      disableClose: true,
      data: {
        titulo: 'Registrar turno',
        subtitulo: 'Agenda veterinaria',
        mensaje: '¿Deseás registrar este turno?',
        tipo: 'save',
        textoAceptar: 'Registrar',
        textoCancelar: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (!resultado) return;

      this.turnoService.agregar({
        mascotaId: mascota.id,
        mascotaNombre: mascota.nombre,
        usuarioEmail: JSON.parse(localStorage.getItem('sesion') || '{}').email,
        fecha: this.fecha,
        hora: this.hora,
        motivo: this.motivo,
        estado: 'Pendiente',
      });

      this.notification.success('Turno registrado correctamente');

      this.mascotaId = 0;
      this.fecha = '';
      this.hora = '';
      this.motivo = '';
    });
  }

  completar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '430px',
      disableClose: true,
      data: {
        titulo: 'Completar turno',
        subtitulo: 'Agenda veterinaria',
        mensaje: '¿Marcar este turno como completado?',
        tipo: 'save',
        textoAceptar: 'Completar',
        textoCancelar: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (!resultado) return;

      this.turnoService.completar(id);

      this.notification.success('Turno completado');
    });
  }

  confirmarEliminarTurno(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '430px',
      disableClose: true,
      data: {
        titulo: 'Eliminar turno',
        subtitulo: 'Agenda veterinaria',
        mensaje: '¿Estás seguro de eliminar este turno?',
        tipo: 'delete',
        textoAceptar: 'Eliminar',
        textoCancelar: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (!resultado) return;

      this.turnoService.eliminar(id);

      this.notification.success('Turno eliminado correctamente');
    });
  }
}
