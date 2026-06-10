import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  adultos = [
    { nombre: 'María Condori', edad: 74, distrito: 'Huancayo', cuidador: 'Ana López', estado: 'Estable' },
    { nombre: 'Felipe Huamán', edad: 81, distrito: 'El Tambo', cuidador: '—', estado: 'Urgente' },
    { nombre: 'Rosa Ccanto', edad: 68, distrito: 'Chilca', cuidador: 'Luis Ríos', estado: 'Observación' },
    { nombre: 'Pedro Solano', edad: 77, distrito: 'Huancayo', cuidador: 'Ana López', estado: 'Estable' },
    { nombre: 'Juana Ramos', edad: 83, distrito: 'Chilca', cuidador: '—', estado: 'Urgente' },
    { nombre: 'Carlos Quispe', edad: 70, distrito: 'El Tambo', cuidador: 'Luis Ríos', estado: 'Observación' },
  ];

  getEstadoClass(estado: string): string {
    if (estado === 'Estable') return 'pill-green';
    if (estado === 'Urgente') return 'pill-red';
    return 'pill-amber';
  }
}