import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
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

  guardando = false;

  constructor(private router: Router, private api: ApiService) {}

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
      dni: this.form.dni,
      nombre: `${this.form.nombres} ${this.form.apellidos}`,
      edad: Number(this.form.edad),
      sexo: this.form.sexo,
      distrito: this.form.distrito,
      lat: null,
      lng: null,
      foto: null,
      condicion: this.normalizarCondicion(this.form.condicion),
      enfermedades: this.form.enfermedades,
      familiar: this.form.familiar,
      telefono: this.form.telefono
    };

    this.api.crearAdulto(payload).subscribe({
      next: () => {
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
    this.router.navigate(['/dashboard']);
  }
}