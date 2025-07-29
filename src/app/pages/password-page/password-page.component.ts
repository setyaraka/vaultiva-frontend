import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzMessageService } from 'ng-zorro-antd/message';

interface FileMetadata {
  visibility: string;
  filename: string;
  isExpired: boolean;
  hasPassword: boolean;
}

@Component({
  selector: 'app-password-page',
  imports: [
    FormsModule, 
    NzInputModule, 
    NzIconModule, 
    CommonModule, 
    NzCardModule,
    NzButtonModule,
    NzAlertModule
  ],
  templateUrl: './password-page.component.html',
  styleUrl: './password-page.component.css'
})
export class PasswordPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  private message = inject(NzMessageService);
  private router = inject(Router);

  fileMetadata: FileMetadata | null = null;
  fileUrl: SafeUrl | null = null;

  fileId: string = '';
  password: string = '';
  passwordVisible = false;
  isLoading: boolean = false;
  
  ngOnInit(): void {
    this.fileId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchMetadata();
  }

  fetchMetadata() {
    this.http.get<FileMetadata>(`${environment.apiUrl}/file/metadata/${this.fileId}`).subscribe({
      next: metadata => {
        this.fileMetadata = metadata;
        if(!metadata.hasPassword){
          this.fetchData();
        }
      },
      error: () => {
        this.message.error("Failed Get Data");
      }
    })
  }

  fetchData() {
    this.isLoading = true;

    const params = this.password
    ? new HttpParams().set('password', this.password)
    : new HttpParams();

    this.http.get(`${environment.apiUrl}/file/preview/${this.fileId}`, {
      params,
      responseType: 'blob'
    }).subscribe({
      next: blob => {
        this.isLoading = false;

        if(this.fileMetadata?.hasPassword){
          this.message.success("Password correct. Redirecting...");
          // this.router.navigate(['/preview', this.fileId]);
          this.router.navigate(['/preview', this.fileId], {
            queryParams: { password: this.password }
          });
        } else {
          const url = URL.createObjectURL(blob);
          this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(url);
          this.message.success("Success Look File")
        }
      },
      error: () => {
        this.isLoading = false;
        this.message.error("Incorrect Password")
      }
    })
  }

  onSubmitPassword() {
    this.fetchData();
  }
}
