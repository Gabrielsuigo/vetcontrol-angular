import { Component, inject, effect } from '@angular/core';
import { MascotaService } from '../../../../core/services/mascota.service';
import { TurnoService } from '../../../../core/services/turno.service';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexDataLabels,
  ApexLegend,
} from 'ng-apexcharts';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.css',
})
export class LineChartComponent {
  mascotaService = inject(MascotaService);
  turnoService = inject(TurnoService);
  constructor() {
    effect(() => {
      this.mascotaService.mascotasUsuario();
      this.turnoService.turnosUsuario();

      this.cargarGrafico();
    });
  }

  public series: ApexAxisChartSeries = [];

  public chart: ApexChart = {
    type: 'line',
    height: 340,
    toolbar: {
      show: false,
    },
  };

  public xaxis: ApexXAxis = {
    categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
  };

  public stroke: ApexStroke = {
    curve: 'smooth',
    width: 3,
  };

  public dataLabels: ApexDataLabels = {
    enabled: false,
  };

  public legend: ApexLegend = {
    position: 'top',
  };

  private obtenerUltimos6Meses() {
    const nombres = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];

    const hoy = new Date();

    console.log('========== MASCOTAS ==========');
    console.log(this.mascotaService.mascotasUsuario());

    console.log('========== TURNOS ==========');
    console.log(this.turnoService.turnosUsuario());

    const meses: { indice: number; nombre: string }[] = [];

    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i);

      meses.push({
        indice: fecha.getMonth(),
        nombre: nombres[fecha.getMonth()],
      });
    }

    return meses;
  }

  private cargarGrafico() {
    const meses = this.obtenerUltimos6Meses();

    const mascotasPorMes = Array(6).fill(0);
    const consultasPorMes = Array(6).fill(0);
    const vacunasPorMes = Array(6).fill(0);
    const turnosPorMes = Array(6).fill(0);

    const hoy = new Date();

    const obtenerIndice = (fechaTexto: string) => {
      const fecha = new Date(fechaTexto);

      const diferenciaMeses =
        (hoy.getFullYear() - fecha.getFullYear()) * 12 + (hoy.getMonth() - fecha.getMonth());

      if (diferenciaMeses >= 0 && diferenciaMeses < 6) {
        return 5 - diferenciaMeses;
      }

      return -1;
    };

    // Mascotas
    this.mascotaService.mascotasUsuario().forEach((mascota) => {
      console.log('Mascota:', mascota.nombre);
      console.log('Fecha registro:', mascota.fechaRegistro);
      console.log('Consultas:', mascota.consultas);
      console.log('Vacunas:', mascota.vacunas);

      if (mascota.fechaRegistro) {
        const indice = obtenerIndice(mascota.fechaRegistro);
        console.log('Mascota:', mascota.fechaRegistro, 'Indice:', indice);

        if (indice >= 0) mascotasPorMes[indice]++;
      }

      mascota.consultas.forEach((consulta) => {
        const indice = obtenerIndice(consulta.fecha);
        console.log('Consulta:', consulta.fecha, 'Indice:', indice);

        if (indice >= 0) consultasPorMes[indice]++;
      });

      mascota.vacunas.forEach((vacuna) => {
        const indice = obtenerIndice(vacuna.fecha);
        console.log('Vacuna:', vacuna.fecha, 'Indice:', indice);

        if (indice >= 0) vacunasPorMes[indice]++;
      });
    });

    // Turnos
    this.turnoService.turnosUsuario().forEach((turno) => {
      console.log('Turno:', turno);
      const indice = obtenerIndice(turno.fecha);

      if (indice >= 0) turnosPorMes[indice]++;
    });

    console.log('Mascotas por mes:', JSON.stringify(mascotasPorMes));
    console.log('Consultas por mes:', JSON.stringify(consultasPorMes));
    console.log('Vacunas por mes:', JSON.stringify(vacunasPorMes));
    console.log('Turnos por mes:', JSON.stringify(turnosPorMes));

    this.series = [
      {
        name: 'Mascotas',
        data: mascotasPorMes,
      },
      {
        name: 'Consultas',
        data: consultasPorMes,
      },
      {
        name: 'Vacunas',
        data: vacunasPorMes,
      },
      {
        name: 'Turnos',
        data: turnosPorMes,
      },
    ];
    console.log('SERIES QUE ENVÍO AL CHART');
    console.log(this.series);

    this.xaxis = {
      categories: meses.map((m) => m.nombre),
    };
  }
}
