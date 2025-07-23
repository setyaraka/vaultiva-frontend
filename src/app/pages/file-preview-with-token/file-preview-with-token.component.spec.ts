import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePreviewWithTokenComponent } from './file-preview-with-token.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormsModule } from '@angular/forms';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';


fdescribe('FilePreviewWithTokenComponent', () => {
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
    // fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should call checkTokenMetadata on init', () => {
    fixture.detectChanges(); // trigger ngOnInit
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
  
});
