import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-file-preview-with-token',
  imports: [
    FormsModule, 
    NzInputModule, 
    NzIconModule, 
    CommonModule, 
    NzCardModule,
    NzButtonModule,
    NzAlertModule,
    NzSpinModule
  ],
  templateUrl: './file-preview-with-token.component.html',
  styleUrl: './file-preview-with-token.component.css'
})
export class FilePreviewWithTokenComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private message = inject(NzMessageService);
  private router = inject(Router);

  @ViewChild('pwdInput') pwdInput!: ElementRef<HTMLInputElement>;

  // UI state
  previewUrl!: SafeResourceUrl;
  objectUrl?: string;         // untuk revoke()
  token = '';
  hasPassword = false;
  password = '';
  passwordVisible = false;
  isLoading = false;
  wrong = false;
  messageError = '';

  // meta
  filename?: string;
  expiresAt?: Date;
  expired = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.resetState();
      this.token = params.get('token') || '';
      this.fetchMeta(this.token);
    });
  }

  ngOnDestroy(): void {
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
  }

  goToLanding() {
    this.router.navigateByUrl('/');
  }

  private resetState() {
    this.previewUrl = undefined as any;
    this.hasPassword = false;
    this.password = '';
    this.passwordVisible = false;
    this.isLoading = false;
    this.wrong = false;
    this.messageError = '';
    this.filename = undefined;
    this.expiresAt = undefined;
    this.expired = false;
    if (this.objectUrl) { URL.revokeObjectURL(this.objectUrl); this.objectUrl = undefined; }
  }

  private fetchMeta(token: string) {
    this.http.get<{ hasPassword: boolean; filename?: string; expiresAt?: string; expired?: boolean; }>(
      `${environment.apiUrl}/file/preview/token/${token}/meta`
    ).subscribe({
      next: res => {
        this.hasPassword = !!res.hasPassword;
        this.filename = res.filename || undefined;
        this.expiresAt = res.expiresAt ? new Date(res.expiresAt) : undefined;
        this.expired = !!res.expired;

        if (this.expired) {
          this.messageError = 'This link has expired.';
          return;
        }
        if (!this.hasPassword) {
          this.loadPreview(token);
        } else {
          // fokus ke input password
          setTimeout(() => this.pwdInput?.nativeElement.focus(), 0);
        }
      },
      error: err => {
        this.messageError = this.pickError(err);
        this.message.error(this.messageError);
      }
    });
  }

  openInNewTab() {
    if (this.objectUrl) window.open(this.objectUrl, '_blank');
  }

  onSubmitPassword() {
    if (!this.password || this.isLoading) return;
    this.isLoading = true;
    this.wrong = false;

    this.http.post(`${environment.apiUrl}/file/preview/token/${this.token}/file`,
      { password: this.password },
      { responseType: 'blob' }
    ).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        this.objectUrl = url;
        this.useBlob(blob);
        this.isLoading = false;
        this.message.success('Password correct');
      },
      error: err => {
        this.isLoading = false;
        const m = this.pickError(err);
        this.wrong = m.toLowerCase().includes('password');
        this.messageError = this.wrong ? '' : m;
        if (this.wrong) this.message.error('Incorrect Password');
      }
    });
  }

  private loadPreview(token: string) {
    this.isLoading = true;
    this.http.post(`${environment.apiUrl}/file/preview/token/${token}/file`,
      { password: '' },
      { responseType: 'blob' }
    ).subscribe({
      next: blob => {
        this.useBlob(blob);
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        this.messageError = this.pickError(err);
        this.message.error('Failed Preview Document');
      }
    });
  }

  private useBlob(blob: Blob) {
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = URL.createObjectURL(blob);
    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl);
  }

  private pickError(err: any): string {
    const s = err?.status;
    if (s === 401 || s === 403) return 'Incorrect password or permission denied.';
    if (s === 410) return 'This link has expired.';
    if (s === 429) return 'Download limit reached.';
    return err?.error?.message || 'Unable to open preview.';
  }
}