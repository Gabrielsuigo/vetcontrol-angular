import { Component, effect, inject, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MascotaService } from '../../core/services/mascota.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-persona-form',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './persona-form.html',
  styleUrl: './persona-form.css',
})
export class PersonaForm {
  nombre = '';
  editando = false;
  especie = '';
  raza = '';
  edad = 0;
  duenio = '';
  imagen = '';

  mascotaId: number | null = null;
  injector = inject(Injector);

  constructor(private mascotaService: MascotaService) {
    effect(() => {
      const mascota = this.mascotaService.mascotaEditando();

      if (mascota) {
        this.editando = true;

        this.nombre = mascota.nombre;
        this.especie = mascota.especie;
        this.raza = mascota.raza;
        this.edad = mascota.edad;
        this.duenio = mascota.duenio;
        this.imagen = mascota.imagen;
      }
    });
  }
  seleccionarImagen(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');

        const MAX_WIDTH = 200;

        const scale = MAX_WIDTH / img.width;

        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        this.imagen = canvas.toDataURL('image/jpeg', 0.3);
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  }

  cargarMascota(mascota: any) {
    this.editando = true;

    this.mascotaId = mascota.id;

    this.nombre = mascota.nombre;
    this.especie = mascota.especie;
    this.raza = mascota.raza;
    this.edad = mascota.edad;
    this.duenio = mascota.duenio;
    this.imagen = mascota.imagen;
  }

  agregar() {
    if (!this.nombre || !this.edad) return;

    const mascota = {
      nombre: this.nombre,
      edad: this.edad,
      especie: this.especie,
      raza: this.raza,
      duenio: this.duenio,
      imagen: this.imagen,

      vacunas: [],
      consultas: [],
    };

    if (this.editando) {
      const mascotaActual = this.mascotaService.mascotaEditando();

      if (mascotaActual) {
        this.mascotaService.editar(mascotaActual.id, mascota);
      }

      this.editando = false;

      this.mascotaService.mascotaEditando.set(null);
    } else {
      this.mascotaService.agregar(mascota);
    }

    this.nombre = '';
    this.especie = '';
    this.raza = '';
    this.edad = 0;
    this.duenio = '';
    this.imagen = '';
  }
}
