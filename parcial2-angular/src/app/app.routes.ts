import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Login } from './login/login';
import { Registrar } from './registrar/registrar';

import { authGuard } from './guards/auth-guard';


export const routes: Routes = [

  {
    path: '',
    component: Home,
    canActivate: [authGuard]
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'registrar',
    component: Registrar
  },

  {
    path: '**',
    redirectTo: ''
  }

];