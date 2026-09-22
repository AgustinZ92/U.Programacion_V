import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private firestore = inject(Firestore);

  private personajesRef = collection(this.firestore, 'personajes');

  crearPersonaje(personaje: any) {
    return addDoc(this.personajesRef, personaje);
  }

  async obtenerPersonajes() {
    const snapshot = await getDocs(this.personajesRef);

    return snapshot.docs.map(documento => ({
      id: documento.id,
      ...documento.data()
    }));
  }

  actualizarPersonaje(id: string, datos: any) {
    const personajeRef = doc(this.firestore, 'personajes', id);

    return updateDoc(personajeRef, datos);
  }

  eliminarPersonaje(id: string) {
    const personajeRef = doc(this.firestore, 'personajes', id);

    return deleteDoc(personajeRef);
  }
}