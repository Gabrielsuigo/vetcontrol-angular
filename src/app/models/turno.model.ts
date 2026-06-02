export interface Turno {
  id: number;

  mascotaId: number;

  mascotaNombre: string;

  fecha: string;

  hora: string;

  motivo: string;

  estado: 'Pendiente' | 'Completado';
}
