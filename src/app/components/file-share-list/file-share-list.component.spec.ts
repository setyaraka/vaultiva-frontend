import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileShareListComponent } from './file-share-list.component';

describe('FileShareListComponent', () => {
  let component: FileShareListComponent;
  let fixture: ComponentFixture<FileShareListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileShareListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileShareListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
