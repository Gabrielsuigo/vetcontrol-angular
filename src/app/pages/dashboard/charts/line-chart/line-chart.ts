import { Component, inject, OnInit } from '@angular/core';
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
export class LineChartComponent implements OnInit {
  mascotaService = inject(MascotaService);
  turnoService = inject(TurnoService);
  ngOnInit(): void {
    this.cargarGrafico();
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
    const mascotasPorMes = [0, 0, 0, 0, 0, 0];
    const consultasPorMes = [0, 0, 0, 0, 0, 0];
    const turnosPorMes = [0, 0, 0, 0, 0, 0];
    const vacunasPorMes = [0, 0, 0, 0, 0, 0];

    const hoy = new Date();

    const anio = hoy.getFullYear();

    const usuarioMascotas = this.mascotaService.mascotasUsuario();

    usuarioMascotas.forEach((m) => {
      // Mascotas registradas
      if (m.fechaRegistro) {
        const fechaMascota = new Date(m.fechaRegistro);

        if (fechaMascota.getFullYear() === anio) {
          const indice = fechaMascota.getMonth();

          if (indice < 6) {
            mascotasPorMes[indice]++;
          }
        }
      }
      m.vacunas.forEach((vacuna) => {
        if (!vacuna.fecha) return;

        const fecha = new Date(vacuna.fecha);

        const diferenciaMeses =
          (hoy.getFullYear() - fecha.getFullYear()) * 12 + (hoy.getMonth() - fecha.getMonth());

        if (diferenciaMeses >= 0 && diferenciaMeses < 6) {
          vacunasPorMes[5 - diferenciaMeses]++;
        }
      });

      // Consultas registradas
      m.consultas.forEach((consulta) => {
        const fechaConsulta = new Date(consulta.fecha);

        if (fechaConsulta.getFullYear() === anio) {
          const indice = fechaConsulta.getMonth();

          if (indice < 6) {
            consultasPorMes[indice]++;
          }
        }
      });
      const usuarioTurnos = this.turnoService.turnosUsuario();

      usuarioTurnos.forEach((t) => {
        if (!t.fecha) return;

        const fecha = new Date(t.fecha);

        const diferenciaMeses =
          (hoy.getFullYear() - fecha.getFullYear()) * 12 + (hoy.getMonth() - fecha.getMonth());

        if (diferenciaMeses >= 0 && diferenciaMeses < 6) {
          turnosPorMes[5 - diferenciaMeses]++;
        }
      });
    });

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
        name: 'Turnos',
        data: turnosPorMes,
      },
      {
        name: 'Vacunas',
        data: vacunasPorMes,
      },
    ];

    this.xaxis = {
      categories: meses.map((m) => m.nombre),
    };
  }
}
