import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

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

  constructor(private router: Router, private api: ApiService) {}

  ingresar() {
    this.error = '';
    if (!this.form.email || !this.form.password) {
      this.error = 'Por favor ingresa tu correo y contraseña.';
      return;
    }
    this.cargando = true;

    this.api.login(this.form.email, this.form.password).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.error = err.error?.error || 'Correo o contraseña incorrectos.';
        this.cargando = false;
      }
    });
  }
}