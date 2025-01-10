// logs.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Log } from '../models/log.model';
import { AuthService } from './auth.service';

export interface Expense {
  expenseId: number;
  expenseDate: string;
  amount: number;
  description: string;
}

interface ApiResponse {
  estado: number;
  msg: string;
  expenses: Expense[];
}

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  //private apiUrl = 'https://cbdf-aam-apicustomer.onrender.com/api/customers';
  private apiUrl = 'https://wcbdf-adl-api-expenses.onrender.com/api/v1/expenses';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getLogs(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.authService.getAuthHeaders() });
  }

  /*getLogs(): Observable<Log[]> {
    return this.http.get<Log[]>(this.apiUrl, { headers: this.authService.getAuthHeaders() });
  }*/

  getLog(id: number): Observable<Log> {
    return this.http.get<Log>(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
  }

  createLog(log: Partial<Log>): Observable<Log> {
    return this.http.post<Log>(this.apiUrl, log, { headers: this.authService.getAuthHeaders() });
  }

  updateLog(id: number, log: Partial<Log>): Observable<Log> {
    return this.http.put<Log>(`${this.apiUrl}/${id}`, log, { headers: this.authService.getAuthHeaders() });
  }

  deleteLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
  }
}