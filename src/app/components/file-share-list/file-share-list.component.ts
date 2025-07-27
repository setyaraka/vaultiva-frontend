import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { formatDateToShort, formatTime } from '../../core/utils/date';
import { environment } from '../../../environment/environment';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';

interface fileShareData {
  email: string,
  maxDownload: number,
  downloadCount: number,
  note: string,
  expiresAt: string,
  createdAt: string,
  token: string
}

interface fileShareState {
  total: number,
  page: number,
  limit: number,
  totalPages: number,
  data: fileShareData[]
}

@Component({
  selector: 'app-file-share-list',
  imports: [
    NzModalModule,
    NzDividerModule,
    NzTableModule,
    CommonModule,
    NzIconModule,
    NzIconModule
  ],
  templateUrl: './file-share-list.component.html',
  styleUrl: './file-share-list.component.css'
})
export class FileShareListComponent implements OnInit {
  private http = inject(HttpClient);
  private message = inject(NzMessageService);
  
  fileId: string = inject(NZ_MODAL_DATA).fileId;

  formatDate = formatDateToShort;
  formatTime = formatTime;

  isLoading = false;
  
  fileShareState: fileShareState = {
    data: [] as fileShareData[],
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  };

  ngOnInit(): void {
    this.fetchData(1);
  }

  fetchData(page: number): void {
    this.isLoading = true;
    const apiUrl = `${environment.apiUrl}/file/share/${this.fileId}/logs`

    this.http.get<fileShareState>(apiUrl, 
      { params: { page, limit: this.fileShareState.limit } 
    })
    .subscribe({
      next: (res) => {
        this.fileShareState = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.message.error("Failed Fetch Data");
      },
    });
  }

  onPageChange(page: number): void {
    this.fileShareState.page = page;
    this.fetchData(page);
  }
}
