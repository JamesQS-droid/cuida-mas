import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alertas.html',
  styleUrl: './alertas.css'
})
export class Alertas {
  filtroActivo = 'todas';

  alertas = [
    { nombre: 'Felipe Huamán', edad: 81, distrito: 'El Tambo', cuidador: '—', dias: 13, tipo: 'urgente' },
    { nombre: 'Juana Ramos', edad: 83, distrito: 'Chilca', cuidador: '—', dias: 11, tipo: 'urgente' },
    { nombre: 'Rosa Ccanto', edad: 68, distrito: 'Chilca', cuidador: 'Luis Ríos', dias: 8, tipo: 'observacion' },
    { nombre: 'Pedro Solano', edad: 77, distrito: 'Huancayo', cuidador: 'Ana López', dias: 7, tipo: 'observacion' },
    { nombre: 'Carlos Quispe', edad: 70, distrito: 'El Tambo', cuidador: '—', dias: 5, tipo: 'sin-cuidador' },
  ];

  get alertasFiltradas() {
    if (this.filtroActivo === 'todas') return this.alertas;
    return this.alertas.filter(a => a.tipo === this.filtroActivo);
  }

  setFiltro(filtro: string) {
    this.filtroActivo = filtro;
  }

  asignarVisita(nombre: string) {
    alert(`✅ Visita asignada para ${nombre}`);
  }

  getTipoLabel(tipo: string): string {
    if (tipo === 'urgente') return 'Urgente';
    if (tipo === 'observacion') return 'Observación';
    return 'Sin cuidador';
  }

  getTipoClass(tipo: string): string {
    if (tipo === 'urgente') return 'tipo-urgente';
    if (tipo === 'observacion') return 'tipo-observacion';
    return 'tipo-sin-cuidador';
  }
}