import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  form = {
    email: '',
    password: ''
  };
  error = '';
  cargando = false;

  // Usuarios mock
  usuarios = [
    { email: 'admin@cuidamas.pe', password: '1234', nombre: 'James Quispe', rol: 'Administrador' },
    { email: 'cuidador@cuidamas.pe', password: '1234', nombre: 'Ana López', rol: 'Cuidadora' },
  ];

  constructor(private router: Router) {}

  ingresar() {
    this.error = '';
    if (!this.form.email || !this.form.password) {
      this.error = 'Por favor ingresa tu correo y contraseña.';
      return;
    }
    this.cargando = true;
    setTimeout(() => {
      const usuario = this.usuarios.find(
        u => u.email === this.form.email && u.password === this.form.password
      );
      if (usuario) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Correo o contraseña incorrectos.';
        this.cargando = false;
      }
    }, 800);
  }
}