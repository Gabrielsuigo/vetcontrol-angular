export interface Vacuna {
  nombre: string;
  fecha: string;
  proximaDosis?: string;
  frecuenciaMeses?: number;
}

export interface Consulta {
  motivo: string;
  diagnostico: string;
  peso: number;
  fecha: string;
}

export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  duenio: string;
  imagen: string;
  usuarioEmail: string;
  fechaRegistro: string;
  vacunas: Vacuna[];
  consultas: Consulta[];
}
