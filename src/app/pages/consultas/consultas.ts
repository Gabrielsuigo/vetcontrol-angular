import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MascotaService } from '../../core/services/mascota.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultas.html',
  styleUrls: ['./consultas.css'],
})
export class Consultas {
  mascotaService = inject(MascotaService);

  cdr = inject(ChangeDetectorRef);

  notification = inject(NotificationService);

  dialog = inject(MatDialog);

  mascotaId = 0;

  motivo = '';

  diagnostico = '';

  peso = 0;

  observaciones = '';

  fecha = new Date().toISOString().split('T')[0];

  // mensajeExito = '';

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
        notas: this.observaciones,
      });

      this.notification.success('Consulta editada correctamente');

      this.modoEdicion = false;
      this.mascotaEditandoId = 0;
      this.consultaEditandoIndex = -1;
      this.mascotaId = 0;
    } else {
      this.mascotaService.agregarConsulta(this.mascotaId, {
        motivo: this.motivo,
        diagnostico: this.diagnostico,
        peso: this.peso,
        fecha: this.fecha,
        notas: this.observaciones,
      });

      this.notification.success('Consulta registrada correctamente');
    }

    this.motivo = '';
    this.diagnostico = '';
    this.peso = 0;
    this.observaciones = '';
    this.fecha = new Date().toISOString().split('T')[0];
  }

  confirmarGuardarConsulta() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '430px',
      disableClose: true,
      data: {
        titulo: this.modoEdicion ? 'Guardar cambios' : 'Registrar consulta',

        subtitulo: 'Consultas médicas',

        mensaje: this.modoEdicion
          ? '¿Deseás guardar los cambios realizados en esta consulta?'
          : '¿Deseás registrar esta consulta para la mascota seleccionada?',

        tipo: 'save',

        textoAceptar: this.modoEdicion ? 'Guardar' : 'Registrar',

        textoCancelar: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.registrarConsulta();
      }
    });
  }
  eliminarConsulta(mascotaId: number, index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '430px',
      disableClose: true,
      data: {
        titulo: 'Eliminar consulta',

        subtitulo: 'Historial médico',

        mensaje:
          '¿Estás seguro de que querés eliminar esta consulta? Esta acción no se puede deshacer.',

        tipo: 'delete',

        textoAceptar: 'Eliminar',

        textoCancelar: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.mascotaService.eliminarConsulta(mascotaId, index);

        this.notification.success('Consulta eliminada correctamente');
      }
    });
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
    this.observaciones = consulta.notas ?? '';

    this.notification.info('Editando consulta');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.mascotaEditandoId = 0;
    this.consultaEditandoIndex = -1;

    this.mascotaId = 0;
    this.motivo = '';
    this.diagnostico = '';
    this.peso = 0;
    this.observaciones = '';
    this.fecha = new Date().toISOString().split('T')[0];

    this.notification.info('Edición cancelada');
  }
}
