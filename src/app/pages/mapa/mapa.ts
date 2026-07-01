import { Component, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ApiService } from '../../services/api';

const COORDS_DISTRITO: { [key: string]: [number, number] } = {
  'Huancayo': [-12.0651, -75.2049],
  'El Tambo': [-12.0531, -75.1932],
  'Chilca':   [-12.0821, -75.2101],
};

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [],
  templateUrl: './mapa.html',
  styleUrl: './mapa.css'
})
export class Mapa implements AfterViewInit, OnDestroy {
  private map!: L.Map;

  adultos: any[] = [];
  total = 0;
  estable = 0;
  observacion = 0;
  urgente = 0;
  huancayo = 0;
  elTambo = 0;
  chilca = 0;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  getColor(condicion: string): string {
    if (condicion === 'urgente')     return '#E24B4A';
    if (condicion === 'observacion') return '#EF9F27';
    return '#1D9E75';
  }

  getEstadoLabel(condicion: string): string {
    if (condicion === 'urgente')     return 'Urgente';
    if (condicion === 'observacion') return 'Observación';
    return 'Estable';
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

    this.api.getAdultos().subscribe({
      next: (data: any[]) => {
        this.adultos = data;
        this.calcularEstadisticas();
        this.agregarMarcadores();
        this.cdr.detectChanges();
      },
      error: () => {
        this.agregarMarcadoresMock();
        this.cdr.detectChanges();
      }
    });

    setTimeout(() => this.map.invalidateSize(), 300);
  }

  calcularEstadisticas() {
    this.total       = this.adultos.length;
    this.estable     = this.adultos.filter(a => a.condicion === 'estable').length;
    this.observacion = this.adultos.filter(a => a.condicion === 'observacion').length;
    this.urgente     = this.adultos.filter(a => a.condicion === 'urgente').length;
    this.huancayo    = this.adultos.filter(a => a.distrito === 'Huancayo').length;
    this.elTambo     = this.adultos.filter(a => a.distrito === 'El Tambo').length;
    this.chilca      = this.adultos.filter(a => a.distrito === 'Chilca').length;
  }

  agregarMarcadores() {
    this.adultos.forEach((adulto) => {
      let lat = adulto.lat;
      let lng = adulto.lng;

      if (!lat || !lng) {
        const base = COORDS_DISTRITO[adulto.distrito] || [-12.0651, -75.2049];
        lat = base[0] + (Math.random() - 0.5) * 0.02;
        lng = base[1] + (Math.random() - 0.5) * 0.02;
      }

      const color = this.getColor(adulto.condicion);
      const label = this.getEstadoLabel(adulto.condicion);

      const icono = L.divIcon({
        className: '',
        html: `<div style="width:16px;height:16px;background:${color};border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const popup = `
          <div style="font-family:sans-serif;min-width:180px">
           ${adulto.foto ? `<img src="${adulto.foto}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />` : ''}
          <div style="font-weight:600;font-size:14px;margin-bottom:6px">${adulto.nombre}</div>
          <div style="font-size:12px;color:#666;margin-bottom:2px">📍 ${adulto.distrito}</div>
          <div style="font-size:12px;color:#666;margin-bottom:2px">🎂 ${adulto.edad} años</div>
          <div style="font-size:12px;color:#666;margin-bottom:6px">👤 ${adulto.cuidador_nombre || '—'}</div>
        <span style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600;background:${color}22;color:${color}">${label}</span>
    </div>`;

      L.marker([lat, lng], { icon: icono })
        .addTo(this.map)
        .bindPopup(popup);
    });
  }

  agregarMarcadoresMock() {
    this.adultos = [
      { nombre: 'María Condori', edad: 74, distrito: 'Huancayo', cuidador_nombre: 'Ana López', condicion: 'estable', lat: -12.0651, lng: -75.2049 },
      { nombre: 'Felipe Huamán', edad: 81, distrito: 'El Tambo', cuidador_nombre: '—', condicion: 'urgente', lat: -12.0531, lng: -75.1932 },
      { nombre: 'Rosa Ccanto', edad: 68, distrito: 'Chilca', cuidador_nombre: 'Luis Ríos', condicion: 'observacion', lat: -12.0821, lng: -75.2101 },
    ];
    this.calcularEstadisticas();
    this.agregarMarcadores();
  }

  ngOnDestroy() {
    if (this.map) this.map.remove();
  }
}