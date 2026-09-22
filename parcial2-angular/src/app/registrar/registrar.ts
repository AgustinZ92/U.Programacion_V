import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import {
  Auth,
  createUserWithEmailAndPassword
} from '@angular/fire/auth';


@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registrar.html',
  styleUrl: './registrar.css'
})
export class Registrar {

  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  errorMessage = '';
  loading = false;


  registerForm = this.fb.nonNullable.group({

    nombre: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ],

    confirmPassword: [
      '',
      Validators.required
    ]

  });


  async registrar() {

    this.errorMessage = '';

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;

    }


    const {
      nombre,
      email,
      password,
      confirmPassword
    } = this.registerForm.getRawValue();


    if (password !== confirmPassword) {

      this.errorMessage =
        'Las contraseñas no coinciden.';

      return;

    }


    this.loading = true;


    try {

      await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      await this.router.navigate(['/']);

    } catch (error: any) {

      console.error(error);

      if (error.code === 'auth/email-already-in-use') {

        this.errorMessage =
          'Ese correo ya está registrado.';

      } else if (error.code === 'auth/weak-password') {

        this.errorMessage =
          'La contraseña debe tener al menos 6 caracteres.';

      } else {

        this.errorMessage =
          'No se pudo crear la cuenta.';

      }

    } finally {

      this.loading = false;

    }

  }


  irALogin() {

    this.router.navigate(['/login']);

  }

}