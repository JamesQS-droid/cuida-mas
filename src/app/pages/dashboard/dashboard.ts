import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  metricas = { total: 0, estable: 0, observacion: 0, urgente: 0 };
  adultos: any[] = [];
  cargando = true;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.api.getDashboard().subscribe({
      next: (res: any) => {
        console.log('Dashboard data:', res);
        this.metricas.total = res.total;
        this.metricas.estable = res.estable;
        this.metricas.observacion = res.observacion;
        this.metricas.urgente = res.urgente;
        this.adultos = res.recientes;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  getEstadoClass(estado: string): string {
    if (estado === 'estable') return 'pill-green';
    if (estado === 'urgente') return 'pill-red';
    return 'pill-amber';
  }
}