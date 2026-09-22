import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  errorMessage = '';
  loading = false;

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async login() {

    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { email, password } = this.loginForm.getRawValue();

    try {

      await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      await this.router.navigate(['/']);

    } catch (error: any) {

      console.error(error);

      this.errorMessage =
        'Correo o contraseña incorrectos.';

    } finally {

      this.loading = false;

    }
  }

  irARegistro() {
    this.router.navigate(['/registrar']);
  }
}