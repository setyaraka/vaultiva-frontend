import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environment/environment';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-file-preview-with-token',
  imports: [CommonModule],
  templateUrl: './file-preview-with-token.component.html',
  styleUrl: './file-preview-with-token.component.css'
})
export class FilePreviewWithTokenComponent implements OnInit {

  private sanitizer = inject(DomSanitizer);
  private route = inject(ActivatedRoute);

  previewUrl!: SafeResourceUrl;
  token = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token') || '';
      this.loadFile(this.token);
    })
  }

  loadFile(token: string) {
    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${environment.apiUrl}/file/preview/token/${token}`
    )
  }
}