import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminLibrosService {
  private librosUrl = 'http://localhost:8082/libros';

  constructor(private http: HttpClient) {}

  getLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.librosUrl).pipe(
      catchError((error) => {
        console.error('Error fetching libros:', error);
        throw error;
      })
    );
  }

  getLibroById(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.librosUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching libro with id ${id}:`, error);
        throw error;
      })
    );
  }

  createLibro(libro: Libro): Observable<Libro> {
    return this.http.post<Libro>(this.librosUrl, libro).pipe(
      catchError((error) => {
        console.error('Error creating libro:', error);
        throw error;
      })
    );
  }

  updateLibro(id: number, libro: Libro): Observable<Libro> {
    return this.http.put<Libro>(`${this.librosUrl}/${id}`, libro).pipe(
      catchError((error) => {
        console.error(`Error updating libro with id ${id}:`, error);
        throw error;
      })
    );
  }

  deleteLibro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.librosUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting libro with id ${id}:`, error);
        throw error;
      })
    );
  }
  buscarPorTitulo(titulo: string): Observable<Libro[]> {
    return this.http
      .get<Libro[]>(
        `${this.librosUrl}/buscar/titulo/${encodeURIComponent(titulo)}`
      )
      .pipe(
        catchError((error) => {
          console.error(`Error buscando por título "${titulo}":`, error);
          throw error;
        })
      );
  }

  buscarPorAutor(autor: string): Observable<Libro[]> {
    return this.http
      .get<Libro[]>(
        `${this.librosUrl}/buscar/autor/${encodeURIComponent(autor)}`
      )
      .pipe(
        catchError((error) => {
          console.error(`Error buscando por autor "${autor}":`, error);
          throw error;
        })
      );
  }

  buscarPorGenero(genero: string): Observable<Libro[]> {
    return this.http
      .get<Libro[]>(
        `${this.librosUrl}/buscar/genero/${encodeURIComponent(genero)}`
      )
      .pipe(
        catchError((error) => {
          console.error(`Error buscando por género "${genero}":`, error);
          throw error;
        })
      );
  }
}

export interface Libro {
  idLibro: number;
  titulo: string;
  autor: string;
  anioPublicacion: number;
  genero: string;
}
