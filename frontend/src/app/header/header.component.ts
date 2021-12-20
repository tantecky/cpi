import { Component, OnInit } from '@angular/core';
import { CpiService } from '../cpi.service';
import { roundCurrency, sleep } from '../utils';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  lastAmount: string = this.initialAmount;

  get initialAmount(): string {
    return roundCurrency(this.cpiService.initialAmount, 0);
  }

  constructor(public cpiService: CpiService) {}

  ngOnInit(): void {
    this.cpiService.isCalculated$.subscribe(async (isCalculated) => {
      if (isCalculated) {
        const start = this.cpiService.initialAmount - 1;
        const end = Math.ceil(this.cpiService.lastAmount);

        await sleep(1000);

        for (let i = start; i >= end; i -= 15) {
          await sleep(10);
          this.lastAmount = roundCurrency(i);
        }

        this.lastAmount = roundCurrency(this.cpiService.lastAmount);
      }
    });
  }
}
