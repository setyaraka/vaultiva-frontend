import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { environment } from '../../../environment/environment';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { formatDateToShort, formatTime } from '../../core/utils/date';
import { NzMessageService } from 'ng-zorro-antd/message';
import { displayVisibility } from '../../core/utils/display';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { AccessLogModalComponent } from '../../components/access-log-modal/access-log-modal.component';
import { RouterLink } from '@angular/router';

interface FileData {
  id: string,
  filename: string,
  createdAt: string,
  expiresAt: string,
  downloadLimit?: number,
  downloadCount?: number,
  shareLink: string,
  visibility: string
}

interface FileListState {
  data: FileData[],
  limit: number,
  page: number,
  total: number,
  totalPages: number,
}

@Component({
  selector: 'app-my-files',
  imports: [
    CommonModule, 
    NzTableModule, 
    NzButtonModule,
    NzDividerModule,
    NzModalModule,
    RouterLink
  ],
  templateUrl: './my-files.component.html',
  styleUrl: './my-files.component.css'
})
export class MyFilesComponent implements OnInit {
  private http = inject(HttpClient);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);

  formatDateToShort = formatDateToShort;
  formatTime = formatTime;
  displayVisibility = displayVisibility;

  fileState: FileListState = {
    data: [] as FileData[],
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  }
  isLoading = false;
  isVisible = false;

  ngOnInit(): void {
    this.fetchFiles(1);
  }

  onPageChange(page: number) {
    this.fetchFiles(page);
  }

  fetchFiles(page: number) {
    this.isLoading = true;
    this.http.get<FileListState>(`${environment.apiUrl}/file/my-files`, {
      params: { page, limit: this.fileState.limit }
    }
    ).subscribe({
      next: (res) => {
        this.fileState = {
          data: res.data,
          page: res.page,
          limit: res.limit,
          total: res.total,
          totalPages: res.totalPages,
        };
      },
      error: () => {},
      complete: () => this.isLoading = false
    });
  }

  downloadFile(fileId: string, filename: string) {
    this.http.get(`${environment.apiUrl}/file/secure-download/${fileId}`, {
      responseType: 'blob',
      observe: 'response'
    }).subscribe({
      next: (res) => {
        const blob = new Blob([res.body!]);
        const url = window.URL.createObjectURL(blob);
  
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
  
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        if (err.status === 403) {
          this.message.error('Download failed:' + (err.error?.message || 'You do not have permission to access this file'));
        } else {
          this.message.error('The file could not be downloaded');
        }
      }
    });
  }

  isExpired(date: string): boolean {
    return new Date(date) < new Date();
  }

  openAccessLogModal(fileId: string) {
    this.modal.create({
      nzTitle: 'File Access Log',
      nzContent: AccessLogModalComponent,
      nzData: { fileId },
      nzFooter: null,
      nzWidth: 1000
    });
  }
}
