import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePreviewWithTokenComponent } from './file-preview-with-token.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormsModule } from '@angular/forms';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

describe('FilePreviewWithTokenComponent', () => {
  let component: FilePreviewWithTokenComponent;
  let fixture: ComponentFixture<FilePreviewWithTokenComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FilePreviewWithTokenComponent,
        FormsModule,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map([['token', 'dummy-token']]))
          }
        },
        {
          provide: NzMessageService,
          useValue: {
            error: jasmine.createSpy('error'),
            success: jasmine.createSpy('success'),
            info: jasmine.createSpy('info')
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilePreviewWithTokenComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call checkTokenMetadata on init', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(`${environment.apiUrl}/file/preview/token/dummy-token/meta`);
    expect(req.request.method).toBe('GET');
    req.flush({ hasPassword: true });
    expect(component.hasPassword).toBeTrue();
  })

  it('should call loadIframe if file is not password protected', () => {
    const spy = spyOn(component as any, 'loadIframe');
    component.checkTokenMetadata('dummy-token');
    const req = httpMock.expectOne(`${environment.apiUrl}/file/preview/token/dummy-token/meta`);
    req.flush({ hasPassword: false });
  
    expect(component.hasPassword).toBeFalse();
    expect(spy).toHaveBeenCalledWith('dummy-token');
  });

  it('should show error message if checkTokenMetadata fails', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(`${environment.apiUrl}/file/preview/token/dummy-token/meta`);
    req.flush({ message: 'Token not found' }, { status: 404, statusText: 'Not Found' });
  
    expect(component.messageError).toBe('Token not found');
  });
  
  it('should load previewUrl and show success if password is correct', () => {
    const blob = new Blob(['dummy file content']);
    component.password = 'secret';
    component.token = 'dummy-token';
  
    component.onSubmitPassword();
  
    const req = httpMock.expectOne(`${environment.apiUrl}/file/preview/token/dummy-token/file`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ password: 'secret' });
  
    req.flush(blob);
  
    expect(component.previewUrl).toBeTruthy();
    expect(component.isLoading).toBeFalse();
  });
  
  it('should show error message if password is incorrect', () => {
    component.password = 'wrong';
    component.token = 'dummy-token';
  
    component.onSubmitPassword();
  
    const req = httpMock.expectOne(`${environment.apiUrl}/file/preview/token/dummy-token/file`);
    req.flush(new Blob([], { type: 'application/octet-stream' }), {
      status: 403,
      statusText: 'Forbidden',
    });
  
    expect(component.isLoading).toBeFalse();
    expect((TestBed.inject(NzMessageService) as any).error).toHaveBeenCalledWith('Incorrect Password');
  });
  
  it('should set previewUrl and stop loading on successful loadIframe', () => {
    const blob = new Blob(['dummy data']);
    component.password = '';
    component.loadIframe('dummy-token');
  
    const req = httpMock.expectOne(`${environment.apiUrl}/file/preview/token/dummy-token/file`);
    expect(req.request.method).toBe('POST');
  
    req.flush(blob);
  
    expect(component.previewUrl).toBeTruthy();
    expect(component.isLoading).toBeFalse();
  });
  
  it('should show error message on failed loadIframe', () => {
    component.loadIframe('dummy-token');
  
    const req = httpMock.expectOne(`${environment.apiUrl}/file/preview/token/dummy-token/file`);
    req.flush(new Blob(), { status: 500, statusText: 'Internal Server Error' });
  
    expect(component.isLoading).toBeFalse();
    expect((TestBed.inject(NzMessageService) as any).error).toHaveBeenCalledWith('Failed Preview Document');
  });

  it('should toggle passwordVisible when icon is clicked', () => {
    component.hasPassword = true;
    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.apiUrl}/file/preview/token/dummy-token/meta`);
    req.flush({ hasPassword: true });
  
    const icon = fixture.nativeElement.querySelector('.ant-input-password-icon');
    icon.click();
  
    expect(component.passwordVisible).toBeTrue();
  });

  afterEach(() => {
    httpMock.verify();
  })
  
});
