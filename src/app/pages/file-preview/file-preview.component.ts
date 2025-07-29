import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-file-preview',
  standalone: true,
  imports: [CommonModule, NzCardModule],
  templateUrl: './file-preview.component.html',
  styleUrl: './file-preview.component.css'
})
export class FilePreviewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  fileId = '';
  password = '';
  imageUrl?: SafeUrl;
  isLoading = true;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.fileId = params.get('id') || '';
      this.route.queryParamMap.subscribe(qParams => {
        this.password = qParams.get('password') || '';
        this.loadFile();
      });
    });
  }

  loadFile() {
    const params = this.password ? new HttpParams().set('password', this.password) : new HttpParams();

    this.http.get(`${environment.apiUrl}/file/preview/${this.fileId}`, {
      params,
      responseType: 'blob'
    }).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        this.isLoading = false;
      },
      error: err => {
        console.error('Failed to load image', err);
        this.isLoading = false;
      }
    });
  }

}
