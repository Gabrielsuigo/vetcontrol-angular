import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioBackend {
  id: number;
  empresa_id: number;
  nombre: string;
  email: string;
  rol: string;
  foto_perfil: string;
  created_at: string;
}

export interface RespuestaAuth {
  mensaje: string;
  token?: string;
  usuario?: UsuarioBackend;
}

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3001/auth';

  registrar(datos: {
    nombre: string;
    email: string;
    password: string;
    nombreComercial: string;
    razonSocial: string;
    pais: string;
    direccion: string;
    telefono: string;
  }): Observable<RespuestaAuth> {
    return this.http.post<RespuestaAuth>(`${this.apiUrl}/register`, datos);
  }

  iniciarSesion(datos: { email: string; password: string }): Observable<RespuestaAuth> {
    return this.http.post<RespuestaAuth>(`${this.apiUrl}/login`, datos);
  }
}
