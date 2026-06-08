export interface Turno {
  id: number;

  mascotaId: number;

  usuarioEmail: string;

  mascotaNombre: string;

  fecha: string;

  hora: string;

  motivo: string;

  estado: 'Pendiente' | 'Completado';
}
