import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePreviewComponent } from './file-preview.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { environment } from '../../../environment/environment';

describe('FilePreviewComponent', () => {
  let component: FilePreviewComponent;
  let fixture: ComponentFixture<FilePreviewComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilePreviewComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map([['id', 'dummy-id']])),
            queryParamMap: of(new Map([['password', 'secret']])),
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilePreviewComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  function flushInitRequest() {
    const req = httpMock.expectOne(`${environment.apiUrl}/file/preview/dummy-id?password=secret`);
    req.flush(new Blob());
  }

  it('should create', () => {
    flushInitRequest();
    expect(component).toBeTruthy();
  });

  it('should extract id and password from route params', () => {
    flushInitRequest();
    expect(component.fileId).toBe('dummy-id');
    expect(component.password).toBe('secret');
  });

  it('should load file and update imageUrl and isLoading', () => {
    const dummyBlob = new Blob(['test'], { type: 'image/png' });
  
    const req = httpMock.expectOne(`${environment.apiUrl}/file/preview/dummy-id?password=secret`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyBlob);
  
    expect(component.isLoading).toBeFalse();
    expect(component.imageUrl).toBeTruthy();
  });
  
  it('should handle error when loadFile fails', () => {
    const req = httpMock.expectOne(`${environment.apiUrl}/file/preview/dummy-id?password=secret`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');

    req.flush(null, { status: 404, statusText: 'Not Found' });
  
    expect(component.isLoading).toBeFalse();
    expect(component.imageUrl).toBeUndefined();
  });

  it('should show loading message when isLoading is true', () => {
    flushInitRequest();
    component.isLoading = true;
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('div');
    expect(el.textContent).toContain('Loading file preview');
  });

  afterEach(() => {
    httpMock.verify();
  });
  
});
