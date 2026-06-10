import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [],
  templateUrl: './mapa.html',
  styleUrl: './mapa.css'
})
export class Mapa implements AfterViewInit, OnDestroy {
  private map!: L.Map;

  adultos = [
    { nombre: 'María Condori', edad: 74, distrito: 'Huancayo', cuidador: 'Ana López', estado: 'Estable', lat: -12.0651, lng: -75.2049 },
    { nombre: 'Felipe Huamán', edad: 81, distrito: 'El Tambo', cuidador: '—', estado: 'Urgente', lat: -12.0531, lng: -75.1932 },
    { nombre: 'Rosa Ccanto', edad: 68, distrito: 'Chilca', cuidador: 'Luis Ríos', estado: 'Observación', lat: -12.0821, lng: -75.2101 },
    { nombre: 'Pedro Solano', edad: 77, distrito: 'Huancayo', cuidador: 'Ana López', estado: 'Estable', lat: -12.0612, lng: -75.2089 },
    { nombre: 'Juana Ramos', edad: 83, distrito: 'Chilca', cuidador: '—', estado: 'Urgente', lat: -12.0891, lng: -75.2045 },
    { nombre: 'Carlos Quispe', edad: 70, distrito: 'El Tambo', cuidador: 'Luis Ríos', estado: 'Observación', lat: -12.0478, lng: -75.1876 },
    { nombre: 'Ana Huanca', edad: 72, distrito: 'Huancayo', cuidador: 'Ana López', estado: 'Estable', lat: -12.0699, lng: -75.2134 },
    { nombre: 'Luis Ore', edad: 78, distrito: 'El Tambo', cuidador: '—', estado: 'Estable', lat: -12.0502, lng: -75.1998 },
  ];

  getColor(estado: string): string {
    if (estado === 'Urgente') return '#E24B4A';
    if (estado === 'Observación') return '#EF9F27';
    return '#1D9E75';
  }

  ngAfterViewInit() {
    setTimeout(() => this.initMap(), 200);
  }

  initMap() {
    const contenedor = document.getElementById('mapa-leaflet');
    if (!contenedor) return;

    this.map = L.map(contenedor, {
      center: [-12.0651, -75.2049],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(this.map);

    this.adultos.forEach(adulto => {
      const color = this.getColor(adulto.estado);
      const icono = L.divIcon({
        className: '',
        html: `<div style="width:16px;height:16px;background:${color};border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const popup = `
        <div style="font-family:sans-serif;min-width:160px">
          <div style="font-weight:600;font-size:14px;margin-bottom:6px">${adulto.nombre}</div>
          <div style="font-size:12px;color:#666;margin-bottom:2px">📍 ${adulto.distrito}</div>
          <div style="font-size:12px;color:#666;margin-bottom:2px">🎂 ${adulto.edad} años</div>
          <div style="font-size:12px;color:#666;margin-bottom:6px">👤 ${adulto.cuidador}</div>
          <span style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600;background:${color}22;color:${color}">${adulto.estado}</span>
        </div>`;

      L.marker([adulto.lat, adulto.lng], { icon: icono })
        .addTo(this.map)
        .bindPopup(popup);
    });

    setTimeout(() => this.map.invalidateSize(), 300);
  }

  ngOnDestroy() {
    if (this.map) this.map.remove();
  }
}