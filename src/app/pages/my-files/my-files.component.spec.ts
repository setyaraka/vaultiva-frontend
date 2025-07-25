import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { MyFilesComponent } from './my-files.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environment/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MyFilesComponent', () => {
  let component: MyFilesComponent;
  let fixture: ComponentFixture<MyFilesComponent>;
  let httpMock: HttpTestingController;
  let modalService: NzModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyFilesComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        NzModalService,
        NzMessageService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyFilesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    modalService = TestBed.inject(NzModalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display files on init', inject([HttpTestingController], (httpMock:HttpTestingController ) => {
    const mockData = {
      data: [
        {
          id: '1',
          filename: 'file1.pdf',
          createdAt: new Date().toISOString(),
          expiresAt: new Date().toISOString(),
          shareLink: 'link',
          visibility: 'PRIVATE',
          originalName: 'file1.pdf',
          downloadLimit: 5,
          downloadCount: 2
        }
      ],
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1
    };
  
    const requests = httpMock.match((req) =>
      req.url === `${environment.apiUrl}/file/my-files` &&
      req.params.get('page') === '1' &&
      req.params.get('limit') === '10'
    );
    
    expect(requests.length).toBe(1);
    requests[0].flush(mockData);
  
    expect(component.fileState.data.length).toBe(1);
    expect(component.fileState.data[0].filename).toBe('file1.pdf');
  }));

  it('should handle error on fetchFiles failure', fakeAsync(() => {
  
    const req = httpMock.expectOne(req =>
      req.url === `${environment.apiUrl}/file/my-files` &&
      req.params.get('page') === '1'
    );
  
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
  
    tick();
    fixture.detectChanges();
  
    expect(component.fileState.data.length).toBe(0);
    expect(component.isLoading).toBeFalse();
  }));

  it('should trigger file download on successful downloadFile', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    const spyCreate = spyOn(document, 'createElement').and.callThrough();
    const spyClick = jasmine.createSpy();
    spyCreate.and.returnValue({ click: spyClick } as any);
  
    component.downloadFile('123', 'file.pdf');
  
    const req = httpMock.expectOne(req =>
      req.url === `${environment.apiUrl}/file/secure-download/123`
    );
    expect(req.request.responseType).toBe('blob');
  
    req.flush(new Blob(['test content'], { type: 'application/pdf' }));
  
    expect(spyCreate).toHaveBeenCalled();
    expect(spyClick).toHaveBeenCalled();
  }));

  it('should show error message on 403 downloadFile', inject(
    [HttpTestingController, NzMessageService],
    (httpMock: HttpTestingController, messageService: NzMessageService) => {
      const msgSpy = spyOn(messageService, 'error');
  
      component.downloadFile('123', 'file.pdf');
  
      const req = httpMock.expectOne(req =>
        req.url === `${environment.apiUrl}/file/secure-download/123`
      );
      req.flush(new Blob(), { status: 403, statusText: 'Forbidden' });
  
      expect(msgSpy).toHaveBeenCalledWith(jasmine.stringMatching(/Download failed/));
    }
  ));
  
  it('should open access log modal', () => {
    const modalSpy = spyOn(component['modal'], 'create');  // ⬅️ akses langsung ke service-nya di dalam komponen
    component.openAccessLogModal('file-id-1');
    expect(modalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      nzContent: jasmine.any(Function),
      nzData: { fileId: 'file-id-1' }
    }));
  });

  it('should open share modal', () => {
    const modalSpy = spyOn(component['modal'], 'create');  // ⬅️ akses langsung ke service-nya di dalam komponen
    component.openShareModal('file-id-2');
    expect(modalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      nzTitle: 'Share File',
      nzData: { fileId: 'file-id-2' }
    }));
  });

  it('should return true if date is expired', () => {
    const pastDate = new Date(Date.now() - 86400000).toISOString();
    expect(component.isExpired(pastDate)).toBeTrue();
  });

  it('should return false if date is not expired', () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString();
    expect(component.isExpired(futureDate)).toBeFalse();
  });
  
});
