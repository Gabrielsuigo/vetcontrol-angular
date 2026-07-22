import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      titulo: string;
      subtitulo?: string;
      mensaje: string;

      tipo?: 'delete' | 'save' | 'warning' | 'logout' | 'info';

      textoAceptar?: string;
      textoCancelar?: string;
    },
  ) {}
  get icono() {
    switch (this.data.tipo) {
      case 'delete':
        return 'delete';

      case 'save':
        return 'save';

      case 'warning':
        return 'warning';

      case 'logout':
        return 'logout';

      default:
        return 'help';
    }
  }

  get color() {
    switch (this.data.tipo) {
      case 'delete':
        return 'warn';

      case 'warning':
        return 'accent';

      case 'logout':
        return 'primary';

      default:
        return 'primary';
    }
  }

  cancelar() {
    this.dialogRef.close(false);
  }

  aceptar() {
    this.dialogRef.close(true);
  }
}
