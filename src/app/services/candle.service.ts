import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Candle } from '../interfaces/candle';

@Injectable({
  providedIn: 'root'
})
export class CandleService {

  private readonly baseUrl = 'http://127.0.0.1:8000/api/auth';


  constructor(private http: HttpClient) { }

  // listCandles() {
  //   return this.http.get<Candle[]>(this.baseUrl);
  // }

  listSymbols() {
    return this.http.get<string[]>(`${this.baseUrl}/symbols/`);
  }

  listBySymbol(symbol: string) {
    return this.http.get<Candle[]>(`${this.baseUrl}/candles/${symbol}/`);
  }

  updateCandles(symbol: string) {
    return this.http.post<any>(`${this.baseUrl}/update-candles/`, { symbol });
  }

  getWithMovingAverages(symbol: string, fast: number, slow: number) {
    return this.http.get<Candle[]>(`${this.baseUrl}/candles/moving-averages/${symbol}/${fast}/${slow}/`);
  }

}
