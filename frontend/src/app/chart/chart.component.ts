import { Component, OnInit } from '@angular/core';
import { CpiService } from '../cpi.service';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  constructor(private cpiService: CpiService) {}

  ngOnInit(): void {}
}
