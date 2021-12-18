import { Component, OnInit, ViewChild } from '@angular/core';
import { CpiService, IDataPoint } from '../cpi.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import 'chartjs-adapter-date-fns';
import { cs } from 'date-fns/locale';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  chartType: ChartType = 'line';
  chartData: ChartData<'line'> = {
    datasets: [
      {
        data: [],
        pointRadius: 0,
        pointHitRadius: 10,
      },
    ],
  };
  chartOptions: ChartConfiguration['options'] = {
    locale: 'cs-CZ',
    elements: {},
    parsing: false,
    scales: {
      x: {
        type: 'timeseries',
        time: {
          tooltipFormat: 'd. M. yyyy',
        },
        grid: {
          display: false,
        },
        adapters: {
          date: {
            locale: cs,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return `${value} Kč`;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  constructor(private cpiService: CpiService) {}

  ngOnInit(): void {
    this.cpiService.fetchData$().subscribe((isReady) => {
      if (isReady) {
        const dataPoints: IDataPoint[] =
          this.cpiService.calculateInflation(1000);

        this.chartData.datasets[0].data.push(...dataPoints);
        this.chart?.update();
      }
    });
  }
}
