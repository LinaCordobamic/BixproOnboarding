import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTiendaComponent } from './crear-tienda.component';

describe('CrearTiendaComponent', () => {
  let component: CrearTiendaComponent;
  let fixture: ComponentFixture<CrearTiendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearTiendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
