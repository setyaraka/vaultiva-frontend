import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzMessageModule,
    NzCardModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false;

  private fb = inject(NonNullableFormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private message = inject(NzMessageService);

  validateForm = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required]),
    remember: this.fb.control(true)
  });

  submitForm(): void {
    this.isLoading = true;
    if (this.validateForm.valid) {
      const { email, password } = this.validateForm.value;
      this.http.post<any>(`${environment.apiUrl}/auth/login`, { email, password }).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.access_token);
          this.router.navigateByUrl('/welcome');
        },
        error: () => {
          this.message.error('Login failed. Check email or password.');
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigateByUrl('/welcome');
    }
  }
}
