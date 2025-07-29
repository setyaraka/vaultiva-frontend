import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordPageComponent } from './password-page.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

describe('PasswordPageComponent', () => {
  let component: PasswordPageComponent;
  let fixture: ComponentFixture<PasswordPageComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { 
            snapshot: { paramMap: convertToParamMap({ id: 'dummy-id' }) } 
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordPageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchMetadata on init', () => {
    const fetchMetadataSpy = spyOn(component as any, 'fetchMetadata');
    component.ngOnInit();
    expect(fetchMetadataSpy).toHaveBeenCalled();
  });

  it('should fetch metadata and set fileMetadata', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(`${environment.apiUrl}/file/metadata/dummy-id`);
    expect(req.request.method).toBe('GET');
  
    const mockMetadata = {
      visibility: 'protected',
      filename: 'sample.pdf',
      isExpired: false,
      hasPassword: true
    };
  
    req.flush(mockMetadata);
    expect(component.fileMetadata).toEqual(mockMetadata);
  });

  it('should call fetchData if hasPassword is false', () => {
    fixture.detectChanges();
    const mockMetadata = {
      visibility: 'public',
      filename: 'sample.pdf',
      isExpired: false,
      hasPassword: false
    };
    const fetchDataSpy = spyOn(component, 'fetchData');
  
    const req = httpMock.expectOne(`${environment.apiUrl}/file/metadata/dummy-id`);
    req.flush(mockMetadata);
  
    expect(fetchDataSpy).toHaveBeenCalled();
  });
  
  it('should call preview API with password', () => {
    component.password = 'secret';
    component.fileId = 'dummy-id';
    component.fileMetadata = { 
      hasPassword: true, 
      visibility: 'protected', 
      isExpired: false, 
      filename: 'file.pdf' 
    };
  
    component.fetchData();
  
    const req = httpMock.expectOne(r =>
      r.url === `${environment.apiUrl}/file/preview/dummy-id` &&
      r.params.has('password') &&
      r.params.get('password') === 'secret'
    );
  
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
  });
  
  it('should call fetchData on submit', () => {
    const fetchDataSpy = spyOn(component, 'fetchData');
    component.onSubmitPassword();
    expect(fetchDataSpy).toHaveBeenCalled();
  });

  afterEach(() => {
    httpMock.verify();
  });  
});
