import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy }, 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    component.validateForm.setValue({ email: '', password: '', remember: false });
    expect(component.validateForm.invalid).toBeTrue();
  });
  
  it('should have valid form when fields are correctly filled', () => {
    component.validateForm.setValue({ email: 'test@mail.com', password: '123456', remember: true });
    expect(component.validateForm.valid).toBeTrue();
  });
  
  it('should mark fields as dirty when form is invalid on submit', () => {
    const emailControl = component.validateForm.controls['email'];
    expect(emailControl.dirty).toBeFalse();
  
    component.submitForm();
  
    expect(emailControl.dirty).toBeTrue();
  });

  it('should save token and navigate on successful login', fakeAsync(() => {
    localStorage.clear();
  
    component.validateForm.setValue({
      email: 'test@mail.com',
      password: '123456',
      remember: true,
    });
  
    component.submitForm();
  
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
  
    req.flush({ access_token: 'dummy-token' });
  
    tick();
  
    expect(localStorage.getItem('token')).toBe('dummy-token');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/welcome');
  }));

  it('should show error message if login fails', inject(
    [HttpTestingController, NzMessageService], 
    (httpMock: HttpTestingController, messageService: NzMessageService) => {
      spyOn(messageService, 'error');
      component.validateForm.setValue({ email: 'test@mail.com', password: 'wrong', remember: false });
    
      component.submitForm();
    
      const req = httpMock.expectOne('http://localhost:3000/auth/login');
      req.flush({}, { status: 401, statusText: 'Unauthorized' });
    
      expect(messageService.error).toHaveBeenCalledWith('Login gagal. Cek email & password.');
      expect(component.isLoading).toBeFalse();
  }));
  
  it('should render the form title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Secura File');
  });
});
