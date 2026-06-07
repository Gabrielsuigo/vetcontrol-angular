import { Injectable, signal, computed } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

import { Mascota, Vacuna, Consulta } from '../../models/mascota.model';

@Injectable({
  providedIn: 'root',
})
export class MascotaService {
  constructor(public authService: AuthService) {}

  mascotas = signal<Mascota[]>(this.cargar());
  mascotaEditando = signal<Mascota | null>(null);

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

  private calcularProximaDosis(fecha: string): string {
    const fechaVacuna = new Date(fecha);

    fechaVacuna.setMonth(fechaVacuna.getMonth() + 12);

    return fechaVacuna.toISOString().split('T')[0];
  }

  agregar(mascota: Omit<Mascota, 'id'>) {
    const usuario = this.authService.usuarioActual();

    if (!usuario) return;

    this.mascotas.update((lista) => {
      const nueva = [
        ...lista,
        {
          ...mascota,
          id: Date.now(),
          usuarioEmail: usuario.email,
          vacunas: [],
          consultas: [],
        },
      ];

      this.guardar(nueva);

      return nueva;
    });
  }

  eliminar(id: number) {
    this.mascotas.update((lista) => {
      const nueva = lista.filter((m) => m.id !== id);

      this.guardar(nueva);

      return nueva;
    });
  }

  editar(id: number, datos: Partial<Mascota>) {
    this.mascotas.update((lista) => {
      const nueva = lista.map((m) => (m.id === id ? { ...m, ...datos } : m));

      this.guardar(nueva);

      return nueva;
    });
  }

  agregarVacuna(id: number, vacuna: Vacuna) {
    this.mascotas.update((lista) => {
      const nueva = lista.map((m) =>
        m.id === id
          ? {
              ...m,
              vacunas: [
                ...(m.vacunas || []),

                {
                  ...vacuna,

                  proximaDosis: this.calcularProximaDosis(vacuna.fecha),
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
}
