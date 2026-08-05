import { Component, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MascotaService } from '../../core/services/mascota.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ViewChild, ElementRef } from '@angular/core';

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
    MatSnackBarModule,
  ],
  templateUrl: './mascota-form.html',
  styleUrl: './mascota-form.css',
})
export class PersonaForm {
  @ViewChild('inputNombre')
  inputNombre!: ElementRef<HTMLInputElement>;
  nombre = '';
  especie = '';
  raza = '';
  edad = 0;
  duenio = '';
  imagen = '';

  editando = false;

  tocado = {
    nombre: false,
    especie: false,
    raza: false,
    edad: false,
    duenio: false,
  };

  constructor(
    public mascotaService: MascotaService,
    private snackBar: MatSnackBar,
  ) {
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

  marcarCampo(campo: keyof typeof this.tocado) {
    this.tocado[campo] = true;
  }

  nombreInvalido() {
    return !/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,40}$/.test(this.nombre.trim());
  }

  especieInvalida() {
    return !/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,30}$/.test(this.especie.trim());
  }

  razaInvalida() {
    return !/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,30}$/.test(this.raza.trim());
  }

  duenioInvalido() {
    return !/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,40}$/.test(this.duenio.trim());
  }

  edadInvalida() {
    return this.edad < 1 || this.edad > 40;
  }

  formularioValido() {
    return (
      !this.nombreInvalido() &&
      !this.especieInvalida() &&
      !this.razaInvalida() &&
      !this.edadInvalida() &&
      !this.duenioInvalido()
    );
  }

  seleccionarImagen(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

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

  agregar() {
    this.tocado = {
      nombre: true,
      especie: true,
      raza: true,
      edad: true,
      duenio: true,
    };

    if (
      this.nombreInvalido() ||
      this.especieInvalida() ||
      this.razaInvalida() ||
      this.edadInvalida() ||
      this.duenioInvalido()
    ) {
      this.snackBar.open('⚠ Complete correctamente todos los campos.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        // panelClass: ['snackbar-warning'],
      });

      return;
    }

    const mascota = {
      nombre: this.nombre,
      edad: this.edad,
      especie: this.especie,
      raza: this.raza,
      duenio: this.duenio,
      imagen: this.imagen,
      usuarioEmail: JSON.parse(localStorage.getItem('sesion') || '{}').email,
      vacunas: [],
      consultas: [],
    };

    let mensaje = '';

    if (this.editando) {
      const mascotaActual = this.mascotaService.mascotaEditando();

      if (mascotaActual) {
        this.mascotaService.editar(mascotaActual.id, mascota);
      }

      this.editando = false;
      this.mascotaService.mascotaEditando.set(null);

      mensaje = '✏️ Mascota actualizada correctamente';
    } else {
      this.mascotaService.agregar(mascota);

      mensaje = '🐾 Mascota registrada correctamente';
    }

    this.nombre = '';
    this.especie = '';
    this.raza = '';
    this.edad = 0;
    this.duenio = '';
    this.imagen = '';

    this.tocado = {
      nombre: false,
      especie: false,
      raza: false,
      edad: false,
      duenio: false,
    };

    setTimeout(() => {
      this.inputNombre?.nativeElement.focus();
    }, 100);

    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'],
    });
  }
}
