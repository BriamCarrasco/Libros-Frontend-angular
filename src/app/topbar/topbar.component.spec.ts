import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { TopbarComponent } from './topbar.component';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TopbarComponent],
    });
  });

  it('should create', () => {
    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    component.ngOnDestroy();
  });

  it('updateDateTime sets fechaHora', () => {
    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.updateDateTime();
    expect(component.fechaHora()).toBeTruthy();
    component.ngOnDestroy();
  });

  it('inicia setInterval y llama updateDateTime', fakeAsync(() => {
    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'updateDateTime').and.callThrough();
    expect((component as any).intervaloId).toBeTruthy();
    tick(1000);
    expect(component.updateDateTime).toHaveBeenCalled();
    component.ngOnDestroy();
  }));

  it('ngOnDestroy limpia el intervalo', () => {
    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(globalThis, 'clearInterval');
    component.ngOnDestroy();
    expect(globalThis.clearInterval).toHaveBeenCalledWith(
      (component as any).intervaloId
    );
  });
});
