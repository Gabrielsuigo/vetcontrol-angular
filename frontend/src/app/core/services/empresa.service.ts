import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Empresa {
  id?: number;
  nombreComercial: string;
  razonSocial: string;
  pais: string;
  direccion: string;
  telefono: string;
}

interface RespuestaActualizarEmpresa {
  mensaje: string;
  empresa: Empresa;
}

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private http = inject(HttpClient);

  empresa = signal<Empresa | null>(null);

  private obtenerBaseUrl(): string {
    return window.location.hostname === 'localhost'
      ? 'http://localhost:3001'
      : 'https://vetcontrol-backend.onrender.com';
  }

  private apiUrl = `${this.obtenerBaseUrl()}/empresa`;

  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  cargarDesdeBackend(): void {
    this.http
      .get<Empresa>(this.apiUrl, {
        headers: this.obtenerHeaders(),
      })
      .subscribe({
        next: (empresa) => {
          this.empresa.set(empresa);
        },
        error: (error) => {
          console.error('Error al cargar los datos de la veterinaria:', error);
          this.empresa.set(null);
        },
      });
  }

  actualizarEmpresa(empresa: Empresa): Observable<RespuestaActualizarEmpresa> {
    return this.http
      .put<RespuestaActualizarEmpresa>(this.apiUrl, empresa, {
        headers: this.obtenerHeaders(),
      })
      .pipe(
        tap((respuesta) => {
          this.empresa.set(respuesta.empresa);
        }),
      );
  }

  // Se mantiene temporalmente porque el registro todavía lo utiliza.
  guardarEmpresa(empresa: Empresa): void {
    this.empresa.set(empresa);
  }
}
