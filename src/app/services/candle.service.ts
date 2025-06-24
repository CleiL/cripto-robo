import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Candle } from '../interfaces/candle';

@Injectable({
  providedIn: 'root'
})
export class CandleService {

  private baseUrl = 'http://127.0.0.1:8000/api/auth/symbols/';


  constructor(private http: HttpClient) { }

  // listCandles() {
  //   return this.http.get<Candle[]>(this.baseUrl);
  // }

  listSymbols() {
    return this.http.get<string[]>(this.baseUrl);
  }

}
