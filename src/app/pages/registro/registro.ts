import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  form = {
    nombres: '',
    apellidos: '',
    dni: '',
    edad: '',
    sexo: '',
    distrito: '',
    condicion: '',
    enfermedades: '',
    familiar: '',
    telefono: ''
  };

  // GPS
  lat: number | null = null;
  lng: number | null = null;
  gpsEstado: 'idle' | 'cargando' | 'ok' | 'error' = 'idle';

  // Foto
  fotoBase64: string | null = null;
  fotoPreview: string | null = null;
  camaraActiva = false;
  videoStream: MediaStream | null = null;

  guardando = false;

  constructor(private router: Router, private api: ApiService) {}

  // ─── GPS ─────────────────────────────────────────────
  obtenerUbicacion() {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      return;
    }
    this.gpsEstado = 'cargando';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.lat = pos.coords.latitude;
        this.lng = pos.coords.longitude;
        this.gpsEstado = 'ok';
      },
      () => {
        this.gpsEstado = 'error';
        alert('No se pudo obtener la ubicación. Verifica los permisos del navegador.');
      }
    );
  }

  // ─── CÁMARA ──────────────────────────────────────────
  async abrirCamara() {
    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      this.camaraActiva = true;
      setTimeout(() => {
        const video = document.getElementById('camara-video') as HTMLVideoElement;
        if (video) video.srcObject = this.videoStream!;
      }, 100);
    } catch {
      alert('No se pudo acceder a la cámara. Verifica los permisos del navegador.');
    }
  }

  tomarFoto() {
    const video = document.getElementById('camara-video') as HTMLVideoElement;
    const canvas = document.createElement('canvas');

    // Comprimir a máximo 800px manteniendo proporción
    const maxW = 800;
    const ratio = Math.min(maxW / video.videoWidth, maxW / video.videoHeight);
    canvas.width  = Math.round(video.videoWidth  * ratio);
    canvas.height = Math.round(video.videoHeight * ratio);

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Comprimir a JPEG calidad 70% — reduce hasta 80% el tamaño
    this.fotoBase64  = canvas.toDataURL('image/jpeg', 0.7);
    this.fotoPreview = this.fotoBase64;
    this.cerrarCamara();
  }

  cerrarCamara() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(t => t.stop());
      this.videoStream = null;
    }
    this.camaraActiva = false;
  }

  eliminarFoto() {
    this.fotoBase64  = null;
    this.fotoPreview = null;
  }

  // ─── GUARDAR ─────────────────────────────────────────
  private normalizarCondicion(valor: string): string {
    const mapa: { [key: string]: string } = {
      'Estable': 'estable',
      'Observación': 'observacion',
      'Urgente': 'urgente'
    };
    return mapa[valor] || 'estable';
  }

  guardar() {
    if (!this.form.nombres || !this.form.apellidos || !this.form.dni ||
        !this.form.edad || !this.form.distrito || !this.form.condicion) {
      alert('Por favor completa los campos obligatorios (*)');
      return;
    }

    this.guardando = true;

    const payload = {
      dni:          this.form.dni,
      nombre:       `${this.form.nombres} ${this.form.apellidos}`,
      edad:         Number(this.form.edad),
      sexo:         this.form.sexo,
      distrito:     this.form.distrito,
      lat:          this.lat,
      lng:          this.lng,
      foto:         this.fotoBase64,
      condicion:    this.normalizarCondicion(this.form.condicion),
      enfermedades: this.form.enfermedades,
      familiar:     this.form.familiar,
      telefono:     this.form.telefono
    };

    this.api.crearAdulto(payload).subscribe({
      next: () => {
        this.cerrarCamara();
        alert(`✅ ${this.form.nombres} ${this.form.apellidos} registrado correctamente.`);
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error('Error:', err);
        alert('❌ Error: ' + (err.error?.detail || 'Intenta nuevamente.'));
        this.guardando = false;
      }
    });
  }

  cancelar() {
    this.cerrarCamara();
    this.router.navigate(['/dashboard']);
  }
}