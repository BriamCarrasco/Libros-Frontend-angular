import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AdminLibrosService, Libro } from './libros.service';

describe('AdminLibrosService', () => {
  let service: AdminLibrosService;
  let httpMock: HttpTestingController;

  const sampleLibro: Libro = {
    idLibro: 1,
    titulo: 'Titulo',
    autor: 'Autor',
    anioPublicacion: 2000,
    genero: 'Genero',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(AdminLibrosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getLibros should GET list of libros', () => {
    const expected = [sampleLibro];
    service.getLibros().subscribe((res) => expect(res).toEqual(expected));
    const req = httpMock.expectOne('http://localhost:8082/libros');
    expect(req.request.method).toBe('GET');
    req.flush(expected);
  });

  it('getLibros should handle error', (done) => {
    service.getLibros().subscribe({
      next: () => fail('expected an error'),
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
    const req = httpMock.expectOne('http://localhost:8082/libros');
    req.flush('fail', { status: 500, statusText: 'Server Error' });
  });

  it('getLibroById should GET by id', () => {
    service
      .getLibroById(1)
      .subscribe((res) => expect(res).toEqual(sampleLibro));
    const req = httpMock.expectOne('http://localhost:8082/libros/1');
    expect(req.request.method).toBe('GET');
    req.flush(sampleLibro);
  });

  it('getLibroById should forward error', (done) => {
    service.getLibroById(1).subscribe({
      next: () => fail('expected error'),
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
    const req = httpMock.expectOne('http://localhost:8082/libros/1');
    req.flush('not found', { status: 404, statusText: 'Not Found' });
  });

  it('createLibro should POST and return created libro', () => {
    service
      .createLibro(sampleLibro)
      .subscribe((res) => expect(res).toEqual(sampleLibro));
    const req = httpMock.expectOne('http://localhost:8082/libros');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(sampleLibro);
    req.flush(sampleLibro);
  });

  it('createLibro should forward error', (done) => {
    service.createLibro(sampleLibro).subscribe({
      next: () => fail('expected error'),
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
    const req = httpMock.expectOne('http://localhost:8082/libros');
    req.flush('bad request', { status: 400, statusText: 'Bad Request' });
  });

  it('updateLibro should PUT and return libro', () => {
    service
      .updateLibro(1, sampleLibro)
      .subscribe((res) => expect(res).toEqual(sampleLibro));
    const req = httpMock.expectOne('http://localhost:8082/libros/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(sampleLibro);
    req.flush(sampleLibro);
  });

  it('updateLibro should forward error', (done) => {
    service.updateLibro(1, sampleLibro).subscribe({
      next: () => fail('expected error'),
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
    const req = httpMock.expectOne('http://localhost:8082/libros/1');
    req.flush('err', { status: 500, statusText: 'Server Error' });
  });

  it('deleteLibro should DELETE and complete', () => {
    service.deleteLibro(1).subscribe((res) => expect(res).toBeNull());
    const req = httpMock.expectOne('http://localhost:8082/libros/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('deleteLibro should forward error', (done) => {
    service.deleteLibro(1).subscribe({
      next: () => fail('expected error'),
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
    const req = httpMock.expectOne('http://localhost:8082/libros/1');
    req.flush('err', { status: 500, statusText: 'Server Error' });
  });

  it('buscarPorTitulo should GET encoded title', () => {
    service
      .buscarPorTitulo('a title')
      .subscribe((res) => expect(res).toEqual([sampleLibro]));
    const req = httpMock.expectOne(
      'http://localhost:8082/libros/buscar/titulo/a%20title'
    );
    expect(req.request.method).toBe('GET');
    req.flush([sampleLibro]);
  });

  it('buscarPorTitulo should forward error', (done) => {
    service.buscarPorTitulo('a title').subscribe({
      next: () => fail('expected error'),
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
    const req = httpMock.expectOne(
      'http://localhost:8082/libros/buscar/titulo/a%20title'
    );
    req.flush('err', { status: 500, statusText: 'Server Error' });
  });

  it('buscarPorAutor should GET encoded autor', () => {
    service
      .buscarPorAutor('un autor')
      .subscribe((res) => expect(res).toEqual([sampleLibro]));
    const req = httpMock.expectOne(
      'http://localhost:8082/libros/buscar/autor/un%20autor'
    );
    expect(req.request.method).toBe('GET');
    req.flush([sampleLibro]);
  });

  it('buscarPorAutor should forward error', (done) => {
    service.buscarPorAutor('un autor').subscribe({
      next: () => fail('expected error'),
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
    const req = httpMock.expectOne(
      'http://localhost:8082/libros/buscar/autor/un%20autor'
    );
    req.flush('err', { status: 500, statusText: 'Server Error' });
  });

  it('buscarPorGenero should GET encoded genero', () => {
    service
      .buscarPorGenero('ficcion')
      .subscribe((res) => expect(res).toEqual([sampleLibro]));
    const req = httpMock.expectOne(
      'http://localhost:8082/libros/buscar/genero/ficcion'
    );
    expect(req.request.method).toBe('GET');
    req.flush([sampleLibro]);
  });

  it('buscarPorGenero should forward error', (done) => {
    service.buscarPorGenero('ficcion').subscribe({
      next: () => fail('expected error'),
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
    const req = httpMock.expectOne(
      'http://localhost:8082/libros/buscar/genero/ficcion'
    );
    req.flush('err', { status: 500, statusText: 'Server Error' });
  });
});
