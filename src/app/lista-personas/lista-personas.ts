import { Component, Input } from '@angular/core';
import { MascotaService } from '../core/services/mascota.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-persona-list',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
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
  @Input() filtro = '';

  @Input() especieFiltro = '';

  @Input() duenioFiltro = '';

  usuarioActual = JSON.parse(localStorage.getItem('sesion') || '{}');

  mascotaEditandoId: number | null = null;
  historialAbiertoId: number | null = null;
  consultasAbiertasId: number | null = null;
  pageSize = 4;

  pageIndex = 0;

  vacunasDisponibles = [
    'Antirrábica',
    'Séxtuple Canina',
    'Octuple Canina',
    'Parvovirus',
    'Moquillo',
    'Hepatitis Canina',
    'Leptospirosis',
    'Coronavirus Canino',
    'Bordetella',
    'Triple Felina',
    'Cuádruple Felina',
    'Leucemia Felina',
    'Rabia Felina',
  ];
  get mascotasFiltradas() {
    return this.personaService.mascotas().filter((m) => {
      const mismoUsuario = m.usuarioEmail === this.usuarioActual.email;

      const coincideNombre = m.nombre.toLowerCase().includes(this.filtro.toLowerCase());

      const coincideEspecie = this.especieFiltro === '' || m.especie === this.especieFiltro;

      const coincideDuenio = this.duenioFiltro === '' || m.duenio === this.duenioFiltro;

      return mismoUsuario && coincideNombre && coincideEspecie && coincideDuenio;
    });
  }
  get mascotasPaginadas() {
    const inicio = this.pageIndex * this.pageSize;
    const fin = inicio + this.pageSize;

    return this.mascotasFiltradas.slice(inicio, fin);
  }
  cambiarPagina(event: PageEvent) {
    this.pageIndex = event.pageIndex;
  }

  constructor(
    public personaService: MascotaService,
    private router: Router,
  ) {}
  editar(mascota: any) {
    this.mascotaEditandoId = mascota.id;
  }

  verFicha(id: number) {
    this.router.navigate(['/mascotas', id]);
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

      this.usuarioActual.email,
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
