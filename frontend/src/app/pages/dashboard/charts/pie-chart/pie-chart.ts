import { Component, Input, OnChanges } from '@angular/core';
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexLegend,
  ApexDataLabels,
  ApexPlotOptions,
  NgApexchartsModule,
} from 'ng-apexcharts';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './pie-chart.html',
  styleUrl: './pie-chart.css',
})
export class PieChartComponent implements OnChanges {
  @Input() mascotas = 0;
  @Input() vacunas = 0;
  @Input() consultas = 0;
  @Input() turnos = 0;

  public series: ApexNonAxisChartSeries = [];

  public chart: ApexChart = {
    type: 'donut',
    height: 300,
  };

  public labels = ['Mascotas', 'Vacunas', 'Consultas', 'Turnos'];

  public colors = ['#6366F1', '#22C55E', '#F97316', '#3B82F6'];

  public legend: ApexLegend = {
    position: 'bottom',
    fontSize: '12px',
    horizontalAlign: 'center',
  };

  public dataLabels: ApexDataLabels = {
    enabled: false,
  };

  public plotOptions: ApexPlotOptions = {
    pie: {
      donut: {
        size: '74%',
      },
    },
  };

  public responsive: ApexResponsive[] = [
    {
      breakpoint: 768,
      options: {
        chart: {
          height: 250,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ];
  ngOnChanges(): void {
    this.series = [this.mascotas, this.vacunas, this.consultas, this.turnos];
  }
}
