import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Optionais } from './optionais';

describe('Optionais', () => {
  let component: Optionais;
  let fixture: ComponentFixture<Optionais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Optionais],
    }).compileComponents();

    fixture = TestBed.createComponent(Optionais);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
