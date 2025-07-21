import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { environment } from '../../../environment/environment';
import { NzMessageService } from 'ng-zorro-antd/message';

interface FileInfo {
  downloadCount: number,
  expiresAt: string,
  fileName: string,
  fileSize: number,
  maxDownload: number,
  note?: string,
  visibility: boolean,
  size: number
}

@Component({
  selector: 'app-share-download',
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzFormModule,
    NzAlertModule,
    NzSpinModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule
  ],
  templateUrl: './share-download.component.html',
  styleUrl: './share-download.component.css'
})
export class ShareDownloadComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private message = inject(NzMessageService);

  token!: string;
  fileInfo: FileInfo = {
    downloadCount: 0,
    expiresAt: '',
    fileName: '',
    fileSize: 0,
    maxDownload: 0,
    note: '',
    visibility: false,
    size: 0
  };

  loading = true;
  error = '';
  password: string = '';
  passwordVisible = false;

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token')!;
    this.fetchFileInfo();
  }

  fetchFileInfo() {
    this.http.get<FileInfo>(`${environment.apiUrl}/file/share/${this.token}`).subscribe({
      next: (res: FileInfo) => {
        this.fileInfo = {
          downloadCount: res?.downloadCount,
          expiresAt: res?.expiresAt,
          fileName: res?.fileName,
          fileSize: res?.fileSize,
          maxDownload: res?.maxDownload,
          note: res?.note,
          visibility: res?.visibility,
          size: 0
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Link tidak valid atau sudah expired';
        this.loading = false;
      },
    });
  }

  downloadFile() {
    this.http.post(`${environment.apiUrl}/file/share/${this.token}/download`, { password: this.password }, { responseType: 'blob' })
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = this.fileInfo.fileName || 'file';
          a.click();
          window.URL.revokeObjectURL(url);
          this.message.success("Success To Download File")
        },
        error: () => {
          this.message.error("Failed to download. Please check password or link");
        }
      });
  }
}
