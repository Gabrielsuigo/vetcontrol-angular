import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MascotaService } from '../../core/services/mascota.service';
import { MatIconModule } from '@angular/material/icon';
import { TurnoService } from '../../core/services/turno.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-detalle-mascota',

  standalone: true,

  imports: [MatIconModule],

  templateUrl: './detalle-mascota.html',

  styleUrl: './detalle-mascota.css',
})
export class DetalleMascota {
  route = inject(ActivatedRoute);

  mascotaService = inject(MascotaService);

  turnoService = inject(TurnoService);

  id = Number(this.route.snapshot.paramMap.get('id'));

  mascota = computed(() => this.mascotaService.mascotas().find((m) => m.id === this.id));

  turnosMascota = computed(() =>
    this.turnoService
      .turnosUsuario()
      .filter((t) => t.mascotaId === this.id)
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()),
  );

  proximoTurno() {
    const pendientes = this.turnosOrdenados().filter((t) => t.estado === 'Pendiente');

    return pendientes.length > 0 ? pendientes[0] : null;
  }
  totalVacunas = computed(() => this.mascota()?.vacunas.length ?? 0);

  totalConsultas = computed(() => this.mascota()?.consultas.length ?? 0);

  totalTurnos = computed(() => this.turnosMascota().length);

  estadoSanitario = computed(() => {
    const vacunas = this.mascota()?.vacunas ?? [];

    if (!vacunas.length) {
      return 'sin-vacunas';
    }

    const hoy = new Date();

    const tieneVencida = vacunas.some((vacuna) => {
      if (!vacuna.proximaDosis) {
        return false;
      }

      return new Date(vacuna.proximaDosis) < hoy;
    });

    if (tieneVencida) {
      return 'pendiente';
    }

    return 'ok';
  });

  mensajeSanitario = computed(() => {
    const vacunas = this.mascota()?.vacunas ?? [];

    if (!vacunas.length) {
      return 'Registrar primera vacuna';
    }

    const hoy = new Date();

    const vencidas = vacunas.filter(
      (vacuna) => vacuna.proximaDosis && new Date(vacuna.proximaDosis) < hoy,
    );

    if (vencidas.length) {
      return `${vencidas.length} vacuna(s) requieren atención`;
    }

    return `${vacunas.length} vacuna(s) registrada(s)`;
  });

  proximaVacuna = computed(() => {
    const vacunas = this.mascota()?.vacunas ?? [];

    const vacunasConProxima = vacunas.filter((vacuna) => vacuna.proximaDosis);

    if (!vacunasConProxima.length) {
      return null;
    }

    return vacunasConProxima.sort(
      (a, b) => new Date(a.proximaDosis!).getTime() - new Date(b.proximaDosis!).getTime(),
    )[0];
  });

  diasParaProximaVacuna = computed(() => {
    const vacuna = this.proximaVacuna();

    if (!vacuna?.proximaDosis) {
      return null;
    }

    const hoy = new Date();

    const fecha = new Date(vacuna.proximaDosis);

    const diferencia = fecha.getTime() - hoy.getTime();

    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  });

  ultimaConsulta = computed(() => {
    const consultas = [...(this.mascota()?.consultas ?? [])];

    if (!consultas.length) {
      return null;
    }

    return consultas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
  });

  vacunasOrdenadas = computed(() =>
    [...(this.mascota()?.vacunas ?? [])].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    ),
  );

  consultasOrdenadas = computed(() =>
    [...(this.mascota()?.consultas ?? [])].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    ),
  );

  turnosOrdenados = computed(() =>
    [...this.turnosMascota()].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    ),
  );

  ultimoPeso = computed(() => {
    const consultas = this.mascota()?.consultas ?? [];

    if (consultas.length === 0) return null;

    return consultas[consultas.length - 1].peso;
  });

  descargarPDF() {
    const mascota = this.mascota();

    if (!mascota) return;

    const pdf = new jsPDF();

    let y = 20;

    pdf.setFontSize(22);
    pdf.text('VetControl - Ficha Veterinaria', 15, y);

    y += 12;

    pdf.setFontSize(10);
    pdf.text(`Generado: ${new Date().toLocaleDateString()}`, 15, y);

    y += 15;

    pdf.setFontSize(12);

    pdf.text(`Dueño: ${mascota.duenio}`, 15, y);
    y += 8;

    pdf.text(`Especie: ${mascota.especie}`, 15, y);
    y += 8;

    pdf.text(`Raza: ${mascota.raza}`, 15, y);
    y += 8;

    pdf.text(`Edad: ${mascota.edad} años`, 15, y);

    y += 15;

    pdf.setFontSize(16);
    pdf.text('Resumen', 15, y);

    y += 10;

    pdf.setFontSize(11);

    pdf.text(`Vacunas registradas: ${mascota.vacunas.length}`, 20, y);

    y += 7;

    pdf.text(`Consultas registradas: ${mascota.consultas.length}`, 20, y);

    y += 7;

    pdf.text(`Turnos registrados: ${this.turnosOrdenados().length}`, 20, y);

    y += 12;

    pdf.setFontSize(16);
    pdf.text('Estado Sanitario', 15, y);

    y += 10;

    pdf.setFontSize(11);

    pdf.text(`Estado: ${this.estadoSanitario()}`, 20, y);

    y += 12;

    const vacuna = this.proximaVacuna();

    if (vacuna) {
      pdf.setFontSize(16);
      pdf.text('Próxima Vacuna', 15, y);

      y += 10;

      pdf.setFontSize(11);

      pdf.text(`${vacuna.nombre}`, 20, y);

      y += 7;

      pdf.text(`Fecha: ${vacuna.proximaDosis}`, 20, y);

      y += 12;
    }

    pdf.setFontSize(16);
    pdf.text('Vacunas', 15, y);

    y += 10;

    if (mascota.vacunas.length === 0) {
      pdf.setFontSize(11);

      pdf.text('No hay vacunas registradas', 20, y);

      y += 7;
    } else {
      mascota.vacunas.forEach((vacuna) => {
        pdf.setFontSize(11);

        pdf.text(`${vacuna.nombre} - ${vacuna.fecha}`, 20, y);

        y += 7;
      });
    }

    y += 10;

    pdf.setFontSize(16);
    pdf.text('Consultas', 15, y);

    y += 10;

    if (mascota.consultas.length === 0) {
      pdf.setFontSize(11);

      pdf.text('No hay consultas registradas', 20, y);

      y += 7;
    } else {
      mascota.consultas.forEach((consulta) => {
        pdf.setFontSize(11);

        pdf.text(`${consulta.fecha} - ${consulta.motivo}`, 20, y);

        y += 7;

        pdf.text(`${consulta.diagnostico}`, 25, y);

        y += 7;
      });
    }

    y += 10;

    pdf.setFontSize(16);
    pdf.text('Turnos', 15, y);

    y += 10;

    if (this.turnosOrdenados().length === 0) {
      pdf.setFontSize(11);

      pdf.text('No hay turnos registrados', 20, y);

      y += 7;
    } else {
      this.turnosOrdenados().forEach((turno) => {
        pdf.setFontSize(11);

        pdf.text(`${turno.fecha} - ${turno.motivo} - ${turno.estado}`, 20, y);

        y += 7;
      });
    }

    pdf.save(`historial-${mascota.nombre}.pdf`);
  }
}
