import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyAO5UTbhRZLXbp5_XhZVYjeU0P3hqIv_u8",
  authDomain: "apirickandmorty-38257.firebaseapp.com",
  projectId: "apirickandmorty-38257",
  storageBucket: "apirickandmorty-38257.firebasestorage.app",
  messagingSenderId: "944385204875",
  appId: "1:944385204875:web:05f7a57ff120ea1d3b2a8e",
  measurementId: "G-7HE5985W59"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),

    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};