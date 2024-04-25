import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarQuadroDialogComponent } from './criar-quadro-dialog.component';

describe('CriarQuadroDialogComponent', () => {
  let component: CriarQuadroDialogComponent;
  let fixture: ComponentFixture<CriarQuadroDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CriarQuadroDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CriarQuadroDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
