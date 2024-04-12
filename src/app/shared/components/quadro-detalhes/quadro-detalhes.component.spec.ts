import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadroDetalheComponent } from './quadro-detalhes.component';

describe('QuadroDetalheComponent', () => {
  let component: QuadroDetalheComponent;
  let fixture: ComponentFixture<QuadroDetalheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuadroDetalheComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuadroDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
