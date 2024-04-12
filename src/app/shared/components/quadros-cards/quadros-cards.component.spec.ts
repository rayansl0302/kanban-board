import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadrosCardsComponent } from './quadros-cards.component';

describe('QuadrosCardsComponent', () => {
  let component: QuadrosCardsComponent;
  let fixture: ComponentFixture<QuadrosCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuadrosCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuadrosCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
