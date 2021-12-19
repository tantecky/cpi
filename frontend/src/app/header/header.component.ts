import { Component, OnInit } from '@angular/core';
import { CpiService } from '../cpi.service';
import { roundCurrency } from '../utils';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  get initialAmount(): string {
    return roundCurrency(this.cpiService.initialAmount, 0);
  }

  get lastAmount(): string {
    return roundCurrency(this.cpiService.lastAmount);
  }

  constructor(public cpiService: CpiService) {}

  ngOnInit(): void {}
}
