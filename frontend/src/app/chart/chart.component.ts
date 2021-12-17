import { Component, OnInit } from '@angular/core';
import { CpiService, IDataPoint } from '../cpi.service';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  constructor(private cpiService: CpiService) {}

  ngOnInit(): void {
    this.cpiService.fetchData$().subscribe((isReady) => {
      if (isReady) {
        const dataPoints: IDataPoint[] =
          this.cpiService.calculateInflation(1000);

        console.log(dataPoints);
      }
    });
  }
}
