import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthApiService, UsuarioBackend } from './auth-api.service';

export interface Usuario {
  id?: number;
  empresa_id?: number;
  nombre: string;
  email: string;
  password?: string;
  rol: string;
  fechaRegistro: string;
  fotoPerfil: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authApi = inject(AuthApiService);

  usuarioActual = signal<Usuario | null>(this.obtenerSesion());

  estaLogueado = computed(() => this.usuarioActual() !== null);

  usuarios = signal<Usuario[]>(this.obtenerUsuarios());

  registrar(usuario: Usuario): boolean {
    const existe = this.usuarios().find((u) => u.email === usuario.email);

    if (existe) return false;

    const nuevoUsuario: Usuario = {
      ...usuario,
      fotoPerfil: usuario.fotoPerfil || '/img/default-user.png',
    };

    const nuevosUsuarios = [...this.usuarios(), nuevoUsuario];

    localStorage.setItem('usuarios', JSON.stringify(nuevosUsuarios));
    this.usuarios.set(nuevosUsuarios);

    return true;
  }

  iniciarSesion(email: string, password: string) {
    return this.authApi.iniciarSesion({
      email: email.trim().toLowerCase(),
      password,
    });
  }

  guardarSesion(usuarioBackend: UsuarioBackend, token: string): void {
    const usuario: Usuario = {
      id: usuarioBackend.id,
      empresa_id: usuarioBackend.empresa_id,
      nombre: usuarioBackend.nombre,
      email: usuarioBackend.email,
      rol: usuarioBackend.rol,
      fechaRegistro: usuarioBackend.created_at,
      fotoPerfil: usuarioBackend.foto_perfil || '/img/default-user.png',
    };

    localStorage.setItem('token', token);
    localStorage.setItem('sesion', JSON.stringify(usuario));

    this.usuarioActual.set(usuario);

    // Cargar las mascotas de la clínica desde PostgreSQL.
  }

  login(email: string, password: string): boolean {
    const usuario = this.usuarios().find((u) => u.email === email && u.password === password);

    if (!usuario) return false;

    localStorage.setItem('sesion', JSON.stringify(usuario));
    this.usuarioActual.set(usuario);

    return true;
  }

  logout(): void {
    localStorage.removeItem('sesion');
    localStorage.removeItem('token');
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

  actualizarUsuario(datos: Partial<Usuario>): boolean {
    const usuario = this.usuarioActual();

    if (!usuario) return false;

    const usuarioActualizado: Usuario = {
      ...usuario,
      ...datos,
    };

    const usuariosActualizados = this.usuarios().map((u) =>
      u.email === usuario.email ? usuarioActualizado : u,
    );

    localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));
    localStorage.setItem('sesion', JSON.stringify(usuarioActualizado));

    this.usuarios.set(usuariosActualizados);
    this.usuarioActual.set(usuarioActualizado);

    return true;
  }

  cambiarPassword(passwordActual: string, passwordNueva: string): boolean {
    const usuario = this.usuarioActual();

    if (!usuario) return false;

    if (usuario.password !== passwordActual) {
      return false;
    }

    return this.actualizarUsuario({
      password: passwordNueva,
    });
  }
}
