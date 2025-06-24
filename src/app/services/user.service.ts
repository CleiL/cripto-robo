import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://127.0.0.1:8000/api/auth'; // ajuste se necessário

  constructor(private http: HttpClient) { }

  getUser(): Observable<IUser> {
    return this.http.get<IUser>(`${this.baseUrl}/me/`);
  }

  updateUser(data: Partial<IUser>): Observable<IUser> {
    return this.http.put<IUser>(`${this.baseUrl}/me/`, data);
  }

  updateBinance(payload: { api_key: string,  api_secret: string }) {
    return this.http.put(`${this.baseUrl}/binance/`, payload);

  }

  getBinance() {
    return this.http.get(`${this.baseUrl}/binance/`);
  }
}
