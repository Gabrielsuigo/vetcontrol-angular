import { Injectable, signal, computed } from '@angular/core';

export interface Usuario {
  nombre: string;

  email: string;

  password: string;

  rol: string;

  fechaRegistro: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  usuarioActual = signal<Usuario | null>(this.obtenerSesion());

  estaLogueado = computed(() => this.usuarioActual() !== null);

  usuarios = signal<Usuario[]>(this.obtenerUsuarios());

  registrar(usuario: Usuario): boolean {
    const existe = this.usuarios().find((u) => u.email === usuario.email);

    if (existe) return false;

    const nuevosUsuarios = [...this.usuarios(), usuario];

    localStorage.setItem('usuarios', JSON.stringify(nuevosUsuarios));

    this.usuarios.set(nuevosUsuarios);

    return true;
  }

  login(email: string, password: string): boolean {
    const usuario = this.usuarios().find((u) => u.email === email && u.password === password);

    if (!usuario) return false;

    localStorage.setItem('sesion', JSON.stringify(usuario));

    this.usuarioActual.set(usuario);

    return true;
  }

  logout() {
    localStorage.removeItem('sesion');

    this.usuarioActual.set(null);
  }

  private obtenerUsuarios(): Usuario[] {
    const usuarios = localStorage.getItem('usuarios');

    return usuarios ? JSON.parse(usuarios) : [];
  }

  private obtenerSesion(): Usuario | null {
    const sesion = localStorage.getItem('sesion');

    return sesion ? JSON.parse(sesion) : null;
  }
}
