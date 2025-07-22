import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environment/environment';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';


@Component({
  selector: 'app-file-preview-with-token',
  imports: [
    FormsModule, 
    NzInputModule, 
    NzIconModule, 
    CommonModule, 
    NzCardModule,
    NzButtonModule,
    NzAlertModule
  ],
  templateUrl: './file-preview-with-token.component.html',
  styleUrl: './file-preview-with-token.component.css'
})
export class FilePreviewWithTokenComponent implements OnInit {

  private sanitizer = inject(DomSanitizer);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private message = inject(NzMessageService);

  previewUrl!: SafeResourceUrl;
  token = '';
  hasPassword = false;
  password = '';
  isLoading = false;
  passwordVisible = false;


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token') || '';
      this.checkTokenMetadata(this.token);
    })
  }

  checkTokenMetadata(token: string) {
    this.http.get<{ hasPassword: boolean }>(`${environment.apiUrl}/file/preview/token/${token}/meta`)
    .subscribe(res => {
      this.hasPassword = res.hasPassword;
      if(!this.hasPassword) {
        this.loadIframe(token);
      }
    })
  }

  onSubmitPassword() {
    this.isLoading = true;
  
    this.http.post(`${environment.apiUrl}/file/preview/token/${this.token}/file`,
      { password: this.password },
      { responseType: 'blob' }
    ).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.isLoading = false;
        this.message.success("Password correct");
      },
      error: () => {
        this.message.error("Incorrect Password");
        this.isLoading = false;
      }
    });
  }

  loadIframe(token: string) {
    this.isLoading = true;

    this.http.post(`${environment.apiUrl}/file/preview/token/${token}/file`,
      { password: this.password },
      { responseType: 'blob' }
    ).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.isLoading = false;
      },
      error: (err) => {
        this.message.error('Failed Preview Document');
        this.isLoading = false;
      }
    });
    // this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    //   `${environment.apiUrl}/file/preview/token/${token}/file`
    // )
  }
}