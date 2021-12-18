import { Component, OnInit, ViewChild } from '@angular/core';
import { CpiService, IDataPoint } from '../cpi.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import 'chartjs-adapter-date-fns';
import { cs } from 'date-fns/locale';

const LOCALE: string = 'cs-CZ';
const LINE_COLOR: string = '#4f4675';
const CURRENCY_SYMBOL: string = 'Kč';

const BANKNOTE = new Image();
BANKNOTE.src = 'assets/1k.jpg';

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
        borderColor: LINE_COLOR,
        pointBackgroundColor: LINE_COLOR,
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: LINE_COLOR,
        fill: {
          value: 1000,
          below: '#ffffff',
        },
      },
    ],
  };
  chartOptions: ChartConfiguration['options'] = {
    responsive: false,
    maintainAspectRatio: false,
    animations: {
      y: {
        easing: 'linear',
        duration: 1000,
        delay: 500,
      },
    },
    locale: LOCALE,
    elements: {},
    parsing: false,
    scales: {
      x: {
        type: 'timeseries',
        time: {
          tooltipFormat: 'd. M. yyyy',
        },
        grid: {
          display: true,
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
          display: true,
        },
        ticks: {
          callback: function (value, index, values) {
            return `${value} ${CURRENCY_SYMBOL}`;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          label: function (context) {
            if (context.parsed.y !== null) {
              const value: number = context.parsed.y;

              const roundedValue: string = value.toLocaleString(LOCALE, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              });

              return `${roundedValue} ${CURRENCY_SYMBOL}`;
            }

            return '';
          },
        },
      },
    },
  };

  chartPlugins = [
    {
      id: 'custom_canvas_background_image',
      beforeDraw: (chart: any) => {
        if (BANKNOTE.complete) {
          const ctx = chart.ctx;
          const x = 55;
          const y = 10;
          const width = 795;
          const height = 387;
          ctx.drawImage(BANKNOTE, x, y, width, height);
        } else {
          BANKNOTE.onload = () => chart.draw();
        }
      },
    },
  ];

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
