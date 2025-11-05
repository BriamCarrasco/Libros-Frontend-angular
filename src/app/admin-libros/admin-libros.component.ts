import { Component, OnInit } from '@angular/core';
import { AdminLibrosService, Libro } from '../services/libros.service';
import { ToastrService } from 'ngx-toastr'; // <-- Agrega esta línea

declare var bootstrap: any;

@Component({
  selector: 'app-admin-libros',
  templateUrl: './admin-libros.component.html',
  styleUrls: ['./admin-libros.component.css'],
})
export class AdminLibrosComponent implements OnInit {
  libros: Libro[] = [];
  filtro: string = 'id';
  valorBusqueda: string = '';
  accionModal: 'crear' | 'editar' = 'crear';
  libroEditando: Partial<Libro> = {};
  page: number = 1;

  constructor(
    private librosService: AdminLibrosService,
    private toastr: ToastrService 
  ) {}

  ngOnInit(): void {
    this.cargarLibros();
  }

  cargarLibros(): void {
    this.librosService.getLibros().subscribe({
      next: (data) => (this.libros = data),
      error: (err) => console.error('Error al cargar libros', err),
    });
  }

  buscar(): void {
    const valor = this.valorBusqueda.trim();
    if (!valor) {
      this.cargarLibros();
      return;
    }

    switch (this.filtro) {
      case 'id':
        const id = Number(valor);
        if (id > 0) {
          this.librosService.getLibroById(id).subscribe({
            next: (libro) => (this.libros = libro ? [libro] : []),
            error: () => (this.libros = []),
          });
        }
        break;
      case 'titulo':
        this.librosService.buscarPorTitulo(valor).subscribe({
          next: (data) => (this.libros = data),
          error: () => (this.libros = []),
        });
        break;
      case 'autor':
        this.librosService.buscarPorAutor(valor).subscribe({
          next: (data) => (this.libros = data),
          error: () => (this.libros = []),
        });
        break;
      case 'genero':
        this.librosService.buscarPorGenero(valor).subscribe({
          next: (data) => (this.libros = data),
          error: () => (this.libros = []),
        });
        break;
    }
  }

  abrirModalCrear(): void {
    this.accionModal = 'crear';
    this.libroEditando = {};
  }

  abrirModalEditar(libro: Libro): void {
    this.accionModal = 'editar';
    this.libroEditando = { ...libro };
  }

  guardarLibro(): void {
    if (
      this.libroEditando.titulo &&
      this.libroEditando.autor &&
      this.libroEditando.anioPublicacion &&
      this.libroEditando.genero
    ) {
      this.cerrarModal();

      if (this.accionModal === 'crear') {
        this.librosService.createLibro(this.libroEditando as Libro).subscribe({
          next: () => {
            this.cargarLibros();
            this.toastr.success('Libro creado correctamente', 'Éxito');
          },
          error: () => this.toastr.error('Error al crear libro', 'Error'),
        });
      } else if (this.accionModal === 'editar' && this.libroEditando.idLibro) {
        this.librosService
          .updateLibro(this.libroEditando.idLibro, this.libroEditando as Libro)
          .subscribe({
            next: () => {
              this.cargarLibros();
              this.toastr.success('Libro actualizado correctamente', 'Éxito');
            },
            error: () => this.toastr.error('Error al actualizar libro', 'Error'),
          });
      }
    }
  }

  cerrarModal(): void {
    const el = document.getElementById('modalLibro');
    if (!el) return;
    const instance = bootstrap?.Modal?.getOrCreateInstance
      ? bootstrap.Modal.getOrCreateInstance(el)
      : new bootstrap.Modal(el);
    instance.hide();
  }

  eliminarLibro(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este libro?')) {
      this.librosService.deleteLibro(id).subscribe({
        next: () => {
          this.cargarLibros();
          this.toastr.success('Libro eliminado correctamente', 'Éxito');
        },
        error: () => this.toastr.error('Error al eliminar libro', 'Error'),
      });
    }
  }

  
}