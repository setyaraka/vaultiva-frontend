import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePreviewWithTokenComponent } from './file-preview-with-token.component';

describe('FilePreviewWithTokenComponent', () => {
  let component: FilePreviewWithTokenComponent;
  let fixture: ComponentFixture<FilePreviewWithTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilePreviewWithTokenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilePreviewWithTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
