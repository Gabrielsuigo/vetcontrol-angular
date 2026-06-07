import { Component, TemplateRef } from '@angular/core';
import { MascotaService } from '../core/services/mascota.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-persona-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
  ],
  templateUrl: './lista-personas.html',
  styleUrl: './lista-personas.css',
})
export class PersonaList {
  filtro = '';

  usuarioActual = JSON.parse(localStorage.getItem('sesion') || '{}');

  mascotaEditandoId: number | null = null;
  historialAbiertoId: number | null = null;
  consultasAbiertasId: number | null = null;
  get mascotasFiltradas() {
    return this.personaService
      .mascotas()
      .filter(
        (m) =>
          m.usuarioEmail === this.usuarioActual.email &&
          m.nombre.toLowerCase().includes(this.filtro.toLowerCase()),
      );
  }

  constructor(public personaService: MascotaService) {}

  editar(mascota: any) {
    this.mascotaEditandoId = mascota.id;
  }

  guardar(mascota: any) {
    this.personaService.editar(mascota.id, mascota);

    this.mascotaEditandoId = null;
  }

  toggleHistorial(id: number) {
    this.historialAbiertoId = this.historialAbiertoId === id ? null : id;
  }

  toggleConsultas(id: number) {
    this.consultasAbiertasId = this.consultasAbiertasId === id ? null : id;
  }

  agregarVacuna(
    id: number,

    nombre: string,

    fecha: string,
  ) {
    if (!nombre || !fecha) return;

    this.personaService.agregarVacuna(
      id,

      {
        nombre,
        fecha,
      },
    );
  }

  eliminar(id: number) {
    this.personaService.eliminar(id);
  }

  eliminarVacuna(
    mascotaId: number,

    index: number,
  ) {
    this.personaService.eliminarVacuna(
      mascotaId,

      index,
    );
  }
  confirmarEliminarVacuna(
    mascotaId: number,

    index: number,
  ) {
    const confirmar = confirm('¿Seguro que querés eliminar esta vacuna?');

    if (confirmar) {
      this.eliminarVacuna(
        mascotaId,

        index,
      );
    }
  }
  agregarConsulta(
    id: number,

    motivo: string,

    diagnostico: string,

    peso: string,

    fecha: string,
  ) {
    if (!motivo || !diagnostico || !peso || !fecha) return;

    this.personaService.agregarConsulta(
      id,

      {
        motivo,

        diagnostico,

        peso: Number(peso),

        fecha,
      },
    );
  }

  eliminarConsulta(
    mascotaId: number,

    index: number,
  ) {
    this.personaService.eliminarConsulta(
      mascotaId,

      index,
    );
  }
}
