import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutPassportComponent } from './layout-passport.component';

describe('LayoutPassportComponent', () => {
  let component: LayoutPassportComponent;
  let fixture: ComponentFixture<LayoutPassportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutPassportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutPassportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
