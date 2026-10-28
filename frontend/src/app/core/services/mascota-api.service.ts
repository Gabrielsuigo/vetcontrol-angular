import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mascota } from '../../models/mascota.model';

@Injectable({
  providedIn: 'root',
})
export class MascotaApiService {
  private http = inject(HttpClient);

  private apiUrl = 'https://vetcontrol-backend.onrender.com/mascotas';

  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  listar(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.apiUrl, {
      headers: this.obtenerHeaders(),
    });
  }

  registrar(
    mascota: Pick<Mascota, 'nombre' | 'especie' | 'raza' | 'edad' | 'duenio' | 'imagen'>,
  ): Observable<Mascota> {
    return this.http.post<Mascota>(this.apiUrl, mascota, {
      headers: this.obtenerHeaders(),
    });
  }
}
