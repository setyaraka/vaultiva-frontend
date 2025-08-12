import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoPreviewComponent } from './demo-preview.component';

describe('DemoPreviewComponent', () => {
  let component: DemoPreviewComponent;
  let fixture: ComponentFixture<DemoPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
