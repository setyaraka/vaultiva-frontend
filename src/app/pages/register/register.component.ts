import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../../environments/environment';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzMessageModule,
    NzCardModule,
    RouterModule,
    NzIconModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  private fb = inject(NonNullableFormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private message = inject(NzMessageService);

  validateForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required, this.matchPasswordValidator.bind(this)]]
  });

  matchPasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!this.validateForm) return null;
    const password = this.validateForm.get('password')?.value;
    return control.value !== password ? { mismatch: true } : null;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  submitForm(): void {
    this.isLoading = true;
    if (this.validateForm.valid) {
      const { email, password } = this.validateForm.value;
      this.http.post<any>(`${environment.apiUrl}/auth/register`, { email, password }).subscribe({
        next: () => {
          this.message.success('Account created! Please log in.');
          this.router.navigateByUrl('/login');
        },
        error: () => {
          this.message.error('Registration failed. Try again.');
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
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