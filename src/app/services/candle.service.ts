import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Candle } from '../interfaces/candle';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandleService {

  private readonly baseUrl = 'http://127.0.0.1:8000/api/auth';


  constructor(private http: HttpClient) { }

  // listCandles() {
  //   return this.http.get<Candle[]>(this.baseUrl);
  // }

  listSymbols(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/symbols/`);
  }

  listBySymbol(symbol: string, startDate?: string, endDate?: string): Observable<Candle[]> {
    let params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    return this.http.get<Candle[]>(`${this.baseUrl}/candles/${symbol}/`, { params });
  }

  updateCandles(symbol: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/update-candles/`, { symbol });
  }

  getWithMovingAverages(
    symbol: string,
    fast: number,
    slow: number,
    startDate?: string,
    endDate?: string
  ): Observable<Candle[]> {
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    return this.http.get<Candle[]>(
      `${this.baseUrl}/candles/moving-averages/${symbol}/${fast}/${slow}/`,
      { params }
    );
  }

  getWithMovingAveragesRSI(
    symbol: string,
    fast: number,
    slow: number,
    startDate?: string,
    endDate?: string
  ): Observable<Candle[]> {
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    return this.http.get<Candle[]>(
      `${this.baseUrl}/candles/moving-averages-rsi/${symbol}/${fast}/${slow}/`,
      { params }
    );
  }

  getWithBB(
    symbol: string,
    fast: number,
    slow: number,
    startDate?: string,
    endDate?: string
  ): Observable<Candle[]> {
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    return this.http.get<Candle[]>(`${this.baseUrl}/candles/bollinger/${symbol}/${fast}/${slow}/`, { params });
  }


}
