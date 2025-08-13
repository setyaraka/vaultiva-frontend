import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TryYourFileComponent } from './try-your-file.component';

describe('TryYourFileComponent', () => {
  let component: TryYourFileComponent;
  let fixture: ComponentFixture<TryYourFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TryYourFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TryYourFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
