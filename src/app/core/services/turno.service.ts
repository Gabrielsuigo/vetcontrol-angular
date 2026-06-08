import { computed } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

import { Injectable, signal } from '@angular/core';

import { Turno } from '../../models/turno.model';

@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  constructor(public authService: AuthService) {}
  turnos = signal<Turno[]>(this.cargar());
  turnosUsuario = computed(() => {
    const usuario = this.authService.usuarioActual();

    if (!usuario) return [];

    return this.turnos().filter((t) => t.usuarioEmail === usuario.email);
  });

  private guardar(data: Turno[]) {
    localStorage.setItem('turnos', JSON.stringify(data));
  }

  private cargar(): Turno[] {
    const data = localStorage.getItem('turnos');

    return data ? JSON.parse(data) : [];
  }

  agregar(turno: Omit<Turno, 'id'>) {
    this.turnos.update((lista) => {
      const nueva: Turno[] = [
        ...lista,
        {
          ...turno,
          id: Date.now(),
        } as Turno,
      ];

      this.guardar(nueva);

      return nueva;
    });
  }

  eliminar(id: number) {
    this.turnos.update((lista) => {
      const nueva = lista.filter((t) => t.id !== id);

      this.guardar(nueva);

      return nueva;
    });
  }

  completar(id: number) {
    this.turnos.update((lista) => {
      const nueva: Turno[] = lista.map((t) =>
        t.id === id
          ? {
              ...t,
              estado: 'Completado' as const,
            }
          : t,
      );

      this.guardar(nueva);

      return nueva;
    });
  }
}
