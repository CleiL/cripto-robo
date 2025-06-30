import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
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

  getAnalysis(
    symbol: string,
    fast: number,
    slow: number,
    start?: string,
    end?: string,
    rsiOverbought = 70,
    rsiOversold = 30
  ): Observable<{ date: string; type: string; price: number }[]> {
    const params: any = {
      start_date: start,
      end_date: end,
      rsi_overbought: rsiOverbought,
      rsi_oversold: rsiOversold
    };
    return this.http.get<{ date: string; type: string; price: number }[]>(
      `${this.baseUrl}/analysis/${symbol}/${fast}/${slow}/`,
      { params }
    );
  }

  getTechnicalAnalysis(
    symbol: string,
    fast: number,
    slow: number,
    start?: string,
    end?: string,
    rsiOverbought?: number,
    rsiOversold?: number
  ): Observable<Candle[]> {
    let params = new HttpParams()
      .set('start_date', start || '')
      .set('end_date', end || '')
      .set('rsi_overbought', rsiOverbought?.toString() || '70')
      .set('rsi_oversold', rsiOversold?.toString() || '30');

    return this.http.get<Candle[]>(
      `${this.baseUrl}/analysis/${symbol}/${fast}/${slow}/`,
      { params }
    );
  }



}
