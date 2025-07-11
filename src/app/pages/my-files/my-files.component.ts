import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { environment } from '../../../environment/environment';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { formatDateToShort, formatTime } from '../../core/utils/date';

interface FileData {
  id: string,
  filename: string,
  createdAt: string,
  expiresAt: string,
  downloadLimit?: number,
  downloadCount?: number,
  shareLink: string
}

interface FileListState {
  data: FileData[],
  limit: number,
  page: number,
  total: number,
  totalPages: number
}

@Component({
  selector: 'app-my-files',
  imports: [
    CommonModule, 
    NzTableModule, 
    NzButtonModule,
    NzDividerModule
  ],
  templateUrl: './my-files.component.html',
  styleUrl: './my-files.component.css'
})
export class MyFilesComponent implements OnInit {
  private http = inject(HttpClient);
  fileState: FileListState = {
    data: [] as FileData[],
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  }
  isLoading = false;

  formatDateToShort = formatDateToShort;
  formatTime = formatTime;

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
        console.log(this.fileState, '>>> FILE STATE')
      },
      error: () => {},
      complete: () => this.isLoading = false
    });
  }

  downloadFile(fileId: string) {
    window.open(`${environment.apiUrl}/file/download/${fileId}`, '_blank');
  }

  isExpired(date: string): boolean {
    return new Date(date) < new Date();
  }
}
