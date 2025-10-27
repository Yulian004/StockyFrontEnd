import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gestione } from './gestione';

describe('Gestione', () => {
  let component: Gestione;
  let fixture: ComponentFixture<Gestione>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gestione]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gestione);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
