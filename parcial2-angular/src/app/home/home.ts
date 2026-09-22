import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { FirestoreService } from '../services/firestore';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  favoritos: any[] = [];
  cargandoFavoritos = false;
  firestoreService = inject(FirestoreService);
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);

  personajes: any[] = [];
  filtrados: any[] = [];
  busqueda = '';
  errorApi = '';

  constructor() {
    this.cargarPersonajes();
    this.cargarFavoritos();
  }

  async cargarFavoritos() {
  try {
    this.cargandoFavoritos = true;

    this.favoritos = await this.firestoreService.obtenerPersonajes();

  } catch (error) {
    console.error(error);
    alert('Error al cargar los favoritos');
  } finally {
    this.cargandoFavoritos = false;
  }
}

async guardarPersonaje(personaje: any) {

  const yaExiste = this.favoritos.some(
    favorito => favorito.nombre === personaje.name
  );

  if (yaExiste) {
    alert('Este personaje ya está en favoritos');
    return;
  }

  try {

    await this.firestoreService.crearPersonaje({
      nombre: personaje.name,
      especie: personaje.species,
      estado: personaje.status,
      imagen: personaje.image
    });

    alert('Personaje guardado correctamente');

    await this.cargarFavoritos();

  } catch (error) {

    console.error(error);
    alert('Error al guardar el personaje');

  }
}

async eliminarFavorito(favorito: any) {

  const confirmar = confirm(
    `¿Querés eliminar a ${favorito.nombre} de favoritos?`
  );

  if (!confirmar) {
    return;
  }

  try {

    await this.firestoreService.eliminarPersonaje(
      favorito.id
    );

    this.favoritos = this.favoritos.filter(
      f => f.id !== favorito.id
    );

    alert('Favorito eliminado correctamente');

  } catch (error) {

    console.error(error);
    alert('Error al eliminar el favorito');

  }
}

async cambiarEstado(favorito: any) {

  const nuevoEstado =
    favorito.estado === 'Alive'
      ? 'Dead'
      : 'Alive';

  try {

    await this.firestoreService.actualizarPersonaje(
      favorito.id,
      {
        estado: nuevoEstado
      }
    );

    favorito.estado = nuevoEstado;

    alert('Favorito actualizado correctamente');

  } catch (error) {

    console.error(error);
    alert('Error al actualizar el favorito');

  }
}
  cargarPersonajes() {

  this.http
    .get<any>('https://rickandmortyapi.com/api/character')
    .subscribe({

      next: data => {

        this.personajes = data.results;
        this.filtrados = data.results;

      },

      error: error => {

        console.error(error);

        this.errorApi =
          'No se pudieron cargar los personajes.';

      }

    });
}

  buscar() {
    this.filtrados = this.personajes.filter(p =>
      p.name.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  async cerrarSesion() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}