import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ─── AUTH ──────────────────────────────────────
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, password });
  }

  // ─── DASHBOARD ─────────────────────────────────
  getDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`, { headers: this.getHeaders() });
  }

  // ─── ADULTOS ───────────────────────────────────
  getAdultos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/adultos`, { headers: this.getHeaders() });
  }

  crearAdulto(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/adultos`, data, { headers: this.getHeaders() });
  }

  actualizarEstado(id: number, condicion: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/adultos/${id}`, { condicion }, { headers: this.getHeaders() });
  }

  // ─── ALERTAS ───────────────────────────────────
  getAlertas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/alertas`, { headers: this.getHeaders() });
  }
}