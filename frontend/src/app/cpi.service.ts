import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import './extensions';

interface ICpiRawData {
  [key: string]: Array<string>;
}

interface IDataPoint {
  x: number; // unix timestamp
  y: number; // amount
}

@Injectable({
  providedIn: 'root',
})
export class CpiService {
  private rawData: ICpiRawData | any = null;

  isReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  fetchData$(): Observable<boolean> {
    this.http.get<ICpiRawData>('/assets/cpi.json').subscribe({
      next: (res) => (this.rawData = res),
      error: (e) => console.error(e),
      complete: () => this.isReady$.next(true),
    });

    return this.isReady$;
  }

  calculateInflation(amount: number): Array<IDataPoint> {
    const years: string[] = Object.keys(this.rawData).sort();
    const firstYear: number = Number(years[0]);

    let dataPoints: IDataPoint[] = [];

    let date = new Date(firstYear, 0, 1);
    console.log(this.rawData);
    dataPoints.push({ x: date.getTime(), y: amount });

    years.forEach((year) => {
      this.rawData[year].forEach((cpi: string) => {
        const factor: number = 1.0 - Number(cpi) / 100.0;
        amount *= factor;
        date.incrementMonth();
        dataPoints.push({ x: date.getTime(), y: amount });
      });
    });

    console.log(amount);
    console.log(date);

    return dataPoints;
  }
}
