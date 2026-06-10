import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  guardar() {
    if (!this.form.nombres || !this.form.apellidos || !this.form.dni || !this.form.edad) {
      alert('Por favor completa los campos obligatorios (*)');
      return;
    }
    alert(`✅ Adulto mayor ${this.form.nombres} ${this.form.apellidos} registrado correctamente.`);
    this.router.navigate(['/dashboard']);
  }

  cancelar() {
    this.router.navigate(['/dashboard']);
  }
}