import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminLibrosComponent } from './admin-libros.component';
import { AdminLibrosService, Libro } from '../services/libros.service';
import { ToastrService } from 'ngx-toastr';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

describe('AdminLibrosComponent', () => {
  let component: AdminLibrosComponent;
  let fixture: ComponentFixture<AdminLibrosComponent>;
  let librosServiceSpy: jasmine.SpyObj<AdminLibrosService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let originalConfirm: any;

  const sampleLibro: Libro = {
    idLibro: 1,
    titulo: 'Titulo',
    autor: 'Autor',
    anioPublicacion: 2000,
    genero: 'Genero',
  };

  beforeEach(() => {
    originalConfirm = globalThis.confirm;
    spyOn(globalThis, 'confirm').and.returnValue(true);
    (globalThis as any).bootstrap = {
      Modal: { getOrCreateInstance: (_el: any) => ({ hide: () => {} }) },
    };

    librosServiceSpy = jasmine.createSpyObj('AdminLibrosService', [
      'getLibros',
      'getLibroById',
      'createLibro',
      'updateLibro',
      'deleteLibro',
      'buscarPorTitulo',
      'buscarPorAutor',
      'buscarPorGenero',
    ]);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    TestBed.configureTestingModule({
      declarations: [AdminLibrosComponent],
      imports: [FormsModule, NgxPaginationModule],
      providers: [
        { provide: AdminLibrosService, useValue: librosServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(AdminLibrosComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    delete (globalThis as any).bootstrap;
    globalThis.confirm = originalConfirm;
    document.getElementById('modalLibro')?.remove();
  });

  it('debe crearse', () => {
    librosServiceSpy.getLibros.and.returnValue(of([sampleLibro]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.libros.length).toBe(1);
  });

  it('cargarLibros asigna libros en caso de éxito', () => {
    librosServiceSpy.getLibros.and.returnValue(of([sampleLibro]));
    component.cargarLibros();
    expect(librosServiceSpy.getLibros).toHaveBeenCalled();
    expect(component.libros).toEqual([sampleLibro]);
  });

  it('cargarLibros registra error en caso de fallo', () => {
    librosServiceSpy.getLibros.and.returnValue(
      throwError(() => new Error('fail'))
    );
    spyOn(console, 'error');
    component.cargarLibros();
    expect(console.error).toHaveBeenCalled();
  });

  it('buscar sin valor llama a cargarLibros', () => {
    spyOn(component, 'cargarLibros');
    component.valorBusqueda = '   ';
    component.buscar();
    expect(component.cargarLibros).toHaveBeenCalled();
  });

  it('buscar por id con id válido asigna libro', () => {
    component.filtro = 'id';
    component.valorBusqueda = '1';
    librosServiceSpy.getLibroById.and.returnValue(of(sampleLibro));
    component.buscar();
    expect(librosServiceSpy.getLibroById).toHaveBeenCalledWith(1);
    expect(component.libros).toEqual([sampleLibro]);
  });

  it('buscar por id con id inválido no llama getLibroById', () => {
    component.filtro = 'id';
    component.valorBusqueda = '0';
    component.buscar();
    expect(librosServiceSpy.getLibroById).not.toHaveBeenCalled();
  });

  it('buscar por id asigna lista vacía cuando no hay libro', () => {
    component.filtro = 'id';
    component.valorBusqueda = '1';
    // Simulamos que el backend devuelve null
    librosServiceSpy.getLibroById.and.returnValue(of(null as any));
    component.buscar();
    expect(librosServiceSpy.getLibroById).toHaveBeenCalledWith(1);
    expect(component.libros).toEqual([]);
  });

  it('buscar por id maneja error dejando lista vacía', () => {
    component.filtro = 'id';
    component.valorBusqueda = '1';
    librosServiceSpy.getLibroById.and.returnValue(
      throwError(() => new Error('err'))
    );
    component.buscar();
    expect(librosServiceSpy.getLibroById).toHaveBeenCalled();
    expect(component.libros).toEqual([]);
  });

  it('buscar por titulo asigna resultados', () => {
    component.filtro = 'titulo';
    component.valorBusqueda = 'Titulo';
    librosServiceSpy.buscarPorTitulo.and.returnValue(of([sampleLibro]));
    component.buscar();
    expect(librosServiceSpy.buscarPorTitulo).toHaveBeenCalledWith('Titulo');
    expect(component.libros).toEqual([sampleLibro]);
  });

  it('buscar por titulo maneja error dejando lista vacía', () => {
    component.filtro = 'titulo';
    component.valorBusqueda = 'Titulo';
    librosServiceSpy.buscarPorTitulo.and.returnValue(
      throwError(() => new Error('err'))
    );
    component.buscar();
    expect(librosServiceSpy.buscarPorTitulo).toHaveBeenCalledWith('Titulo');
    expect(component.libros).toEqual([]);
  });

  it('buscar por autor asigna resultados', () => {
    component.filtro = 'autor';
    component.valorBusqueda = 'Autor';
    librosServiceSpy.buscarPorAutor.and.returnValue(of([sampleLibro]));
    component.buscar();
    expect(librosServiceSpy.buscarPorAutor).toHaveBeenCalledWith('Autor');
    expect(component.libros).toEqual([sampleLibro]);
  });

  it('buscar por autor maneja error dejando lista vacía', () => {
    component.filtro = 'autor';
    component.valorBusqueda = 'Autor';
    librosServiceSpy.buscarPorAutor.and.returnValue(
      throwError(() => new Error('err'))
    );
    component.buscar();
    expect(librosServiceSpy.buscarPorAutor).toHaveBeenCalledWith('Autor');
    expect(component.libros).toEqual([]);
  });

  it('buscar por genero asigna resultados', () => {
    component.filtro = 'genero';
    component.valorBusqueda = 'Genero';
    librosServiceSpy.buscarPorGenero.and.returnValue(of([sampleLibro]));
    component.buscar();
    expect(librosServiceSpy.buscarPorGenero).toHaveBeenCalledWith('Genero');
    expect(component.libros).toEqual([sampleLibro]);
  });

  it('buscar por genero maneja error dejando lista vacía', () => {
    component.filtro = 'genero';
    component.valorBusqueda = 'Genero';
    librosServiceSpy.buscarPorGenero.and.returnValue(
      throwError(() => new Error('err'))
    );
    component.buscar();
    expect(librosServiceSpy.buscarPorGenero).toHaveBeenCalledWith('Genero');
    expect(component.libros).toEqual([]);
  });

  it('abrirModalCrear resetea estado para crear', () => {
    component.libroEditando = { titulo: 'X' };
    component.accionModal = 'editar';
    component.abrirModalCrear();
    expect(component.accionModal).toBe('crear');
    expect(component.libroEditando).toEqual({});
  });

  it('abrirModalEditar coloca libro en edición', () => {
    component.abrirModalEditar(sampleLibro);
    expect(component.accionModal).toBe('editar');
    expect(component.libroEditando).toEqual(sampleLibro);
  });

  it('guardarLibro no actúa si faltan campos', () => {
    spyOn(component, 'cerrarModal');
    librosServiceSpy.createLibro.and.returnValue(of(sampleLibro));
    component.libroEditando = { titulo: 'X' } as any;
    component.accionModal = 'crear';
    component.guardarLibro();
    expect(component.cerrarModal).not.toHaveBeenCalled();
    expect(librosServiceSpy.createLibro).not.toHaveBeenCalled();
  });

  it('guardarLibro crea libro con éxito', () => {
    spyOn(component, 'cerrarModal').and.callThrough();
    spyOn(component, 'cargarLibros');
    component.accionModal = 'crear';
    component.libroEditando = { ...sampleLibro } as any;
    librosServiceSpy.createLibro.and.returnValue(of(sampleLibro));
    component.guardarLibro();
    expect(librosServiceSpy.createLibro).toHaveBeenCalledWith(sampleLibro);
    expect(component.cargarLibros).toHaveBeenCalled();
    expect(toastrSpy.success).toHaveBeenCalledWith(
      'Libro creado correctamente',
      'Éxito'
    );
  });

  it('guardarLibro maneja error en creación', () => {
    spyOn(component, 'cerrarModal').and.callThrough();
    component.accionModal = 'crear';
    component.libroEditando = { ...sampleLibro } as any;
    librosServiceSpy.createLibro.and.returnValue(
      throwError(() => new Error('err'))
    );
    component.guardarLibro();
    expect(toastrSpy.error).toHaveBeenCalledWith(
      'Error al crear libro',
      'Error'
    );
  });

  it('guardarLibro actualiza libro con éxito', () => {
    spyOn(component, 'cerrarModal').and.callThrough();
    spyOn(component, 'cargarLibros');
    component.accionModal = 'editar';
    component.libroEditando = { ...sampleLibro } as any;
    librosServiceSpy.updateLibro.and.returnValue(of(sampleLibro));
    component.guardarLibro();
    expect(librosServiceSpy.updateLibro).toHaveBeenCalledWith(
      sampleLibro.idLibro,
      sampleLibro
    );
    expect(component.cargarLibros).toHaveBeenCalled();
    expect(toastrSpy.success).toHaveBeenCalledWith(
      'Libro actualizado correctamente',
      'Éxito'
    );
  });

  it('guardarLibro maneja error en actualización', () => {
    component.accionModal = 'editar';
    spyOn(component, 'cerrarModal').and.callThrough();
    component.libroEditando = { ...sampleLibro } as any;
    librosServiceSpy.updateLibro.and.returnValue(
      throwError(() => new Error('err'))
    );
    component.guardarLibro();
    expect(toastrSpy.error).toHaveBeenCalledWith(
      'Error al actualizar libro',
      'Error'
    );
  });

  it('guardarLibro en editar sin id no llama update', () => {
    spyOn(component, 'cerrarModal').and.callThrough();
    spyOn(component, 'cargarLibros');
    component.accionModal = 'editar';
    component.libroEditando = {
      titulo: 'X',
      autor: 'Y',
      anioPublicacion: 2020,
      genero: 'Z',
    } as any;
    librosServiceSpy.updateLibro.and.returnValue(of(sampleLibro));
    component.guardarLibro();
    expect(component.cerrarModal).toHaveBeenCalled();
    expect(librosServiceSpy.updateLibro).not.toHaveBeenCalled();
    expect(librosServiceSpy.createLibro).not.toHaveBeenCalled();
  });

  it('cerrarModal no hace nada si no existe elemento', () => {
    document.getElementById('modalLibro')?.remove();
    component.cerrarModal();
  });

  it('cerrarModal usa getOrCreateInstance cuando existe', () => {
    const modalEl = document.createElement('div');
    modalEl.id = 'modalLibro';
    document.body.appendChild(modalEl);
    const hideSpy = jasmine.createSpy('hide');
    (globalThis as any).bootstrap = {
      Modal: {
        getOrCreateInstance: (_el: any) => ({ hide: hideSpy }),
      },
    };
    component.cerrarModal();
    expect(hideSpy).toHaveBeenCalled();
  });

  it('cerrarModal usa new Modal cuando getOrCreateInstance no existe', () => {
    const modalEl = document.createElement('div');
    modalEl.id = 'modalLibro';
    document.body.appendChild(modalEl);
    const hideSpy = jasmine.createSpy('hide');
    (globalThis as any).bootstrap = {
      Modal: function (_el: any) {
        return { hide: hideSpy };
      },
    };
    component.cerrarModal();
    expect(hideSpy).toHaveBeenCalled();
  });

  it('eliminarLibro no hace nada si cancelas confirm', () => {
    (globalThis as any).confirm.and.returnValue(false);
    component.eliminarLibro(1);
    expect(librosServiceSpy.deleteLibro).not.toHaveBeenCalled();
  });

  it('eliminarLibro borra y muestra success', () => {
    (globalThis as any).confirm.and.returnValue(true);
    spyOn(component, 'cargarLibros');
    librosServiceSpy.deleteLibro.and.returnValue(of(void 0));
    component.eliminarLibro(1);
    expect(librosServiceSpy.deleteLibro).toHaveBeenCalledWith(1);
    expect(component.cargarLibros).toHaveBeenCalled();
    expect(toastrSpy.success).toHaveBeenCalledWith(
      'Libro eliminado correctamente',
      'Éxito'
    );
  });

  it('eliminarLibro maneja error en delete', () => {
    (globalThis as any).confirm.and.returnValue(true);
    librosServiceSpy.deleteLibro.and.returnValue(
      throwError(() => new Error('err'))
    );
    component.eliminarLibro(1);
    expect(toastrSpy.error).toHaveBeenCalledWith(
      'Error al eliminar libro',
      'Error'
    );
  });
});
