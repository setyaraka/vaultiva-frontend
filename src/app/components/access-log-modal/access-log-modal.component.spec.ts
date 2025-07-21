import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessLogModalComponent } from './access-log-modal.component';

describe('AccessLogModalComponent', () => {
  let component: AccessLogModalComponent;
  let fixture: ComponentFixture<AccessLogModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessLogModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessLogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
