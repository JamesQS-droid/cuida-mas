import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alertas.html',
  styleUrl: './alertas.css'
})
export class Alertas implements OnInit {
  filtroActivo = 'todas';
  alertas: any[] = [];
  cargando = true;

  get urgentes() {
  return this.alertas.filter(a => (a.tipo || a.condicion) === 'urgente').length;
}

get enObservacion() {
  return this.alertas.filter(a => (a.tipo || a.condicion) === 'observacion').length;
}

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

ngOnInit() {
  this.api.getAdultos().subscribe({
    next: (adultos: any[]) => {
      this.alertas = adultos
        .filter(a => a.condicion === 'urgente' || a.condicion === 'observacion')
        .map(a => ({
          nombre: a.nombre,
          edad: a.edad,
          distrito: a.distrito,
          cuidador: a.cuidador_nombre || '—',
          dias: 0,
          tipo: a.condicion,
          condicion: a.condicion
        }));
      this.cargando = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  });
}
  get alertasFiltradas() {
    if (this.filtroActivo === 'todas') return this.alertas;
    if (this.filtroActivo === 'sin-cuidador')
      return this.alertas.filter(a => !a.cuidador || a.cuidador === '—');
    return this.alertas.filter(a => a.tipo === this.filtroActivo || a.condicion === this.filtroActivo);
  }

  setFiltro(filtro: string) {
    this.filtroActivo = filtro;
  }

  asignarVisita(nombre: string) {
    alert(`✅ Visita asignada para ${nombre}`);
  }

  getTipoLabel(alerta: any): string {
    const tipo = alerta.tipo || alerta.condicion;
    if (tipo === 'urgente') return 'Urgente';
    if (tipo === 'observacion') return 'Observación';
    return 'Sin cuidador';
  }

  getTipoClass(alerta: any): string {
    const tipo = alerta.tipo || alerta.condicion;
    if (tipo === 'urgente') return 'tipo-urgente';
    if (tipo === 'observacion') return 'tipo-observacion';
    return 'tipo-sin-cuidador';
  }
}