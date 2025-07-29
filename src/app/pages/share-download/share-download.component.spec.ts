import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ShareDownloadComponent } from './share-download.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { environment } from '../../../environments/environment';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NzMessageService } from 'ng-zorro-antd/message';

describe('ShareDownloadComponent', () => {
  let component: ShareDownloadComponent;
  let fixture: ComponentFixture<ShareDownloadComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareDownloadComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ token: 'dummy-token' }) } 
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareDownloadComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  function flushInitRequest() {
    // Simulate initial GET file info request with dummy token
    const req = httpMock.expectOne(`${environment.apiUrl}/file/share/dummy-token`);
    req.flush({});
  }

  it('should create', () => {
    flushInitRequest();
    expect(component).toBeTruthy();
  });

  it('should fetch and display file info', () => {
    const httpMock = TestBed.inject(HttpTestingController);
    const mockData = {
      downloadCount: 3,
      expiresAt: '2025-12-01',
      fileName: 'example.pdf',
      fileSize: 123456,
      maxDownload: 5,
      note: 'Confidential file',
      visibility: true,
      size: 123456
    };
  
    fixture.detectChanges();
  
    const req = httpMock.expectOne(`${environment.apiUrl}/file/share/dummy-token`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  
    fixture.detectChanges();
  
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('example.pdf');
    expect(compiled.textContent).toContain('123,456');
    expect(compiled.textContent).toContain('Confidential file');
  });

  it('should show error message when fetchFileInfo fails', () => {
    const httpMock = TestBed.inject(HttpTestingController);
  
    fixture.detectChanges();
  
    const req = httpMock.expectOne(`${environment.apiUrl}/file/share/dummy-token`);
    req.error(new ProgressEvent('error'));
  
    fixture.detectChanges();
  
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('The link is invalid or has expired');
  });
  
  it('should download file on valid password', fakeAsync(() => {
    flushInitRequest();
    const httpMock = TestBed.inject(HttpTestingController);
    const mockBlob = new Blob(['test content'], { type: 'application/pdf' });
  
    component.token = 'dummy-id';
    component.password = 'secret';
    component.fileInfo = {
      fileName: 'myfile.pdf',
      visibility: true,
      note: '',
      size: 123,
      downloadCount: 1,
      expiresAt: '',
      fileSize: 123,
      maxDownload: 3
    };
  
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');
    const a = document.createElement('a');
    spyOn(document, 'createElement').and.returnValue(a);
    spyOn(a, 'click');
  
    const messageSpy = spyOn(TestBed.inject(NzMessageService), 'success');
  
    component.downloadFile();
  
    const req = httpMock.expectOne(`${environment.apiUrl}/file/share/dummy-id/download`);
    req.flush(mockBlob);
  
    tick();
    expect(messageSpy).toHaveBeenCalledWith('Success To Download File');
  }));
  
  it('should show error message when download fails', () => {
    flushInitRequest();
    const httpMock = TestBed.inject(HttpTestingController);
    const messageSpy = spyOn(TestBed.inject(NzMessageService), 'error');
  
    component.token = 'dummy-id';
    component.password = 'wrong-pass';
    component.fileInfo = {
      fileName: 'abc.pdf',
      visibility: true,
      note: '',
      size: 123,
      downloadCount: 1,
      expiresAt: '',
      fileSize: 123,
      maxDownload: 3
    };
  
    component.downloadFile();
  
    const req = httpMock.expectOne(`${environment.apiUrl}/file/share/dummy-id/download`);
    req.flush(null, { status: 401, statusText: 'Unauthorized' });
  
    expect(messageSpy).toHaveBeenCalledWith('Failed to download. Please check password or link');
  });
  
  it('should toggle password visibility', () => {
    flushInitRequest();
    expect(component.passwordVisible).toBe(false);
    component.passwordVisible = !component.passwordVisible;
    expect(component.passwordVisible).toBe(true);
  });
  

  it('should show spinner when loading', () => {
    flushInitRequest();
    component.loading = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('nz-spin')).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
