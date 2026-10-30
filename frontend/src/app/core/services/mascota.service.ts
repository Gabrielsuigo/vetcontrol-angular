import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { MascotaApiService } from './mascota-api.service';
import { Mascota, Vacuna, Consulta } from '../../models/mascota.model';

@Injectable({
  providedIn: 'root',
})
export class MascotaService {
  private mascotaApi = inject(MascotaApiService);
  constructor(public authService: AuthService) {}

  mascotas = signal<Mascota[]>(this.cargar());
  mascotaEditando = signal<Mascota | null>(null);

  cargarDesdeBackend(): void {
    this.mascotaApi.listar().subscribe({
      next: (mascotas) => {
        this.mascotas.set(mascotas);
      },
      error: (error) => {
        console.error('Error al cargar mascotas desde PostgreSQL:', error);
      },
    });
  }

  mascotasUsuario = computed(() => {
    const usuario = this.authService.usuarioActual();

    if (!usuario) return [];

    return this.mascotas().filter((m) => m.usuarioEmail === usuario.email);
  });

  private guardar(data: Mascota[]) {
    localStorage.setItem('mascotas', JSON.stringify(data));
  }

  private cargar(): Mascota[] {
    const data = localStorage.getItem('mascotas');
    return data ? JSON.parse(data) : [];
  }

  private calcularProximaDosis(fecha: string, meses: number): string {
    const fechaVacuna = new Date(fecha);

    fechaVacuna.setMonth(fechaVacuna.getMonth() + meses);

    return fechaVacuna.toISOString().split('T')[0];
  }

  agregar(mascota: Omit<Mascota, 'id' | 'fechaRegistro'>) {
    const usuario = this.authService.usuarioActual();

    if (!usuario) return;

    this.mascotas.update((lista) => {
      const nueva = [
        ...lista,
        {
          ...mascota,
          id: Date.now(),
          usuarioEmail: usuario.email,

          fechaRegistro: new Date().toISOString().split('T')[0],

          vacunas: [],
          consultas: [],
        },
      ];

      this.guardar(nueva);

      return nueva;
    });
  }

  agregarDesdeBackend(
    mascota: Pick<Mascota, 'nombre' | 'especie' | 'raza' | 'edad' | 'duenio' | 'imagen'>,
    alGuardar: (mascota: Mascota) => void,
    alError: (mensaje: string) => void,
  ): void {
    this.mascotaApi.registrar(mascota).subscribe({
      next: (nuevaMascota) => {
        this.mascotas.update((lista) => [...lista, nuevaMascota]);
        alGuardar(nuevaMascota);
      },
      error: (error) => {
        console.error('Error al registrar mascota en PostgreSQL:', error);

        const mensaje =
          error?.error?.mensaje || 'No se pudo registrar la mascota. Intentá nuevamente.';

        alError(mensaje);
      },
    });
  }

  eliminar(id: number) {
    this.mascotas.update((lista) => {
      const nueva = lista.filter((m) => m.id !== id);

      this.guardar(nueva);

      return nueva;
    });
  }

  editar(
    id: number,
    datos: Pick<Mascota, 'nombre' | 'especie' | 'raza' | 'edad' | 'duenio' | 'imagen'>,
    alGuardar: (mascota: Mascota) => void,
    alError: (mensaje: string) => void,
  ): void {
    this.mascotaApi.editar(id, datos).subscribe({
      next: (mascotaActualizada) => {
        this.mascotas.update((lista) => lista.map((m) => (m.id === id ? mascotaActualizada : m)));

        alGuardar(mascotaActualizada);
      },
      error: (error) => {
        console.error('Error al editar mascota en PostgreSQL:', error);

        const mensaje =
          error?.error?.mensaje || 'No se pudo actualizar la mascota. Intentá nuevamente.';

        alError(mensaje);
      },
    });
  }

  agregarVacuna(id: number, vacuna: Vacuna, meses: number) {
    this.mascotas.update((lista) => {
      const nueva = lista.map((m) =>
        m.id === id
          ? {
              ...m,
              vacunas: [
                ...(m.vacunas || []),

                {
                  ...vacuna,
                  frecuenciaMeses: meses,
                  proximaDosis: this.calcularProximaDosis(vacuna.fecha, meses),
                },
              ],
            }
          : m,
      );

      this.guardar(nueva);

      return nueva;
    });
  }
  agregarConsulta(
    id: number,

    consulta: Consulta,
  ) {
    this.mascotas.update((lista) => {
      const nueva = lista.map((m) =>
        m.id === id
          ? {
              ...m,

              consultas: [...(m.consultas || []), consulta],
            }
          : m,
      );

      this.guardar(nueva);

      return nueva;
    });
  }

  eliminarVacuna(
    mascotaId: number,

    index: number,
  ) {
    this.mascotas.update((lista) => {
      const nueva = lista.map((m) =>
        m.id === mascotaId
          ? {
              ...m,

              vacunas: m.vacunas.filter((_, i) => i !== index),
            }
          : m,
      );

      this.guardar(nueva);

      return nueva;
    });
  }
  eliminarConsulta(
    mascotaId: number,

    index: number,
  ) {
    this.mascotas.update((lista) => {
      const nueva = lista.map((m) =>
        m.id === mascotaId
          ? {
              ...m,

              consultas: m.consultas.filter((_, i) => i !== index),
            }
          : m,
      );

      this.guardar(nueva);

      return nueva;
    });
  }
  editarConsulta(mascotaId: number, index: number, consultaActualizada: Consulta) {
    this.mascotas.update((lista) => {
      const nueva = lista.map((m) =>
        m.id === mascotaId
          ? {
              ...m,
              consultas: m.consultas.map((c, i) => (i === index ? consultaActualizada : c)),
            }
          : m,
      );

      this.guardar(nueva);

      return nueva;
    });
  }
  editarVacuna(mascotaId: number, index: number, vacunaActualizada: Vacuna, meses: number) {
    this.mascotas.update((lista) => {
      const nueva = lista.map((m) =>
        m.id === mascotaId
          ? {
              ...m,
              vacunas: m.vacunas.map((v, i) =>
                i === index
                  ? {
                      ...vacunaActualizada,
                      frecuenciaMeses: meses,
                      proximaDosis: this.calcularProximaDosis(vacunaActualizada.fecha, meses),
                    }
                  : v,
              ),
            }
          : m,
      );

      this.guardar(nueva);

      return nueva;
    });
  }
}
