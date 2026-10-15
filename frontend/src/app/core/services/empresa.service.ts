import { Injectable, signal } from '@angular/core';

export interface Empresa {
  nombreComercial: string;

  razonSocial: string;

  pais: string;

  direccion: string;

  telefono: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  empresa = signal<Empresa | null>(this.obtenerEmpresa());

  guardarEmpresa(empresa: Empresa) {
    localStorage.setItem('empresa', JSON.stringify(empresa));

    this.empresa.set(empresa);
  }

  private obtenerEmpresa(): Empresa | null {
    const empresa = localStorage.getItem('empresa');

    return empresa ? JSON.parse(empresa) : null;
  }
}
