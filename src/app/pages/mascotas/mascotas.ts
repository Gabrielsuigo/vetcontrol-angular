import { Component } from '@angular/core';
import { PersonaList } from '../../lista-mascotas/lista-mascotas';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

import { MascotaService } from '../../core/services/mascota.service';
import { PersonaForm } from '../../components/mascotas-form/mascota-form';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [
    CommonModule,
    PersonaList,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './mascotas.html',
  styleUrls: ['./mascotas.css'],
})
export class Mascotas {
  filtro = '';

  especieFiltro = '';

  duenioFiltro = '';

  get duenios(): string[] {
    const usuario = this.personaService.authService.usuarioActual();

    if (!usuario) return [];

    const lista = this.personaService
      .mascotas()
      .filter((m) => m.usuarioEmail === usuario.email)
      .map((m) => m.duenio);

    return [...new Set(lista)].sort();
  }

  constructor(
    public personaService: MascotaService,
    private dialog: MatDialog,
  ) {}

  abrirFormulario() {
    this.dialog.open(PersonaForm, {
      width: '900px',

      maxWidth: '95vw',

      autoFocus: false,
    });
  }
}
