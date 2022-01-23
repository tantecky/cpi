import { Component, OnInit, ViewChild } from '@angular/core';
import { CpiService, IDataPoint } from '../cpi.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import 'chartjs-adapter-date-fns';
import { cs } from 'date-fns/locale';
import { CURRENCY_SYMBOL, LOCALE, roundCurrency } from '../utils';

const LINE_COLOR: string = '#251e52';
const FONT_AXIS: any = {
  weight: 'bold',
  size: 14,
};

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
        animations: {
          y: {
            duration: 2000,
            delay: 0,
          },
        },
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
        easing: 'easeInOutElastic',
        from: (ctx: any) => {
          if (ctx.type === 'data') {
            if (ctx.mode === 'default' && !ctx.dropped) {
              ctx.dropped = true;
              return 0;
            }
          }

          return 1000;
        },
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
        ticks: {
          font: FONT_AXIS,
          color: LINE_COLOR,
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
          font: FONT_AXIS,
          color: LINE_COLOR,
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

              return roundCurrency(value);
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
          const x = 64;
          const y = 12;
          const width = BANKNOTE.width;
          const height = BANKNOTE.height;
          const chartAreaWidth = chart.chartArea.width;

          ctx.drawImage(BANKNOTE, x, y, Math.ceil(chartAreaWidth + 2), height);
        } else {
          BANKNOTE.onload = () => chart.draw();
        }
      },
    },
  ];

  constructor(private cpiService: CpiService) {}

  ngOnInit(): void {
    this.cpiService.fetchData$().subscribe((isReadyForCalculation) => {
      if (isReadyForCalculation) {
        const dataPoints: IDataPoint[] = this.cpiService.calculateInflation();
        this.chartData.datasets[0].data.push(...dataPoints);
        this.chart?.update();
      }
    });
  }
}
