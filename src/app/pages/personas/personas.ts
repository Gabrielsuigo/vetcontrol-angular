import { Component } from '@angular/core';
import { PersonaList } from '../../lista-personas/lista-personas';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { MascotaService } from '../../core/services/mascota.service';
import { PersonaForm } from '../../components/persona-form/persona-form';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [
    PersonaList,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './personas.html',
  styleUrls: ['./personas.css'],
})
export class Mascotas {
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
