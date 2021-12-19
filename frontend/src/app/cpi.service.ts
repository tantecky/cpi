import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import './extensions';

interface ICpiRawData {
  [key: string]: Array<string>;
}

export interface IDataPoint {
  x: number; // unix timestamp
  y: number; // amount
}

@Injectable({
  providedIn: 'root',
})
export class CpiService {
  private rawData: ICpiRawData | any = null;

  isReadyForCalculation$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  isCalculated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  firstYear: Date = new Date();
  lastYear: Date = new Date();
  initialAmount: number = 1000;
  lastAmount: number = 1000;

  constructor(private http: HttpClient) {}

  fetchData$(): Observable<boolean> {
    this.http.get<ICpiRawData>('/assets/cpi.json').subscribe({
      next: (res) => (this.rawData = res),
      error: (e) => console.error(e),
      complete: () => this.isReadyForCalculation$.next(true),
    });

    return this.isReadyForCalculation$;
  }

  calculateInflation(): Array<IDataPoint> {
    let amount: number = this.initialAmount;
    const years: string[] = Object.keys(this.rawData).sort();
    const firstYear: number = Number(years[0]);

    let dataPoints: IDataPoint[] = [];

    let date = new Date(firstYear, 0, 1);
    this.firstYear = new Date(date);
    dataPoints.push({ x: date.getTime(), y: amount });

    years.forEach((year) => {
      this.rawData[year].forEach((cpi: string) => {
        const factor: number = 1.0 - Number(cpi) / 100.0;
        amount *= factor;
        date.incrementMonth();
        dataPoints.push({ x: date.getTime(), y: amount });
      });
    });

    this.lastYear = new Date(date);
    this.lastAmount = amount;
    this.isCalculated$.next(true);

    return dataPoints;
  }
}
