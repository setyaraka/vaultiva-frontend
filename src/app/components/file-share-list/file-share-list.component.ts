import { HttpClient } from '@angular/common/http';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalModule } from 'ng-zorro-antd/modal';
import { formatDateToShort, formatTime } from '../../core/utils/date';
import { environment } from '../../../environments/environment';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

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
    NzEmptyModule,
    NzPaginationModule
  ],
  templateUrl: './file-share-list.component.html',
  styleUrl: './file-share-list.component.css'
})
export class FileShareListComponent implements OnInit {
  private http = inject(HttpClient);
  
  fileId: string = inject(NZ_MODAL_DATA).fileId;

  formatDate = formatDateToShort;
  formatTime = formatTime;

  isLoading = false;
  isMobile = false;
  
  fileShareState: fileShareState = {
    data: [] as fileShareData[],
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  };

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;
    this.fetchData(1);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
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
      },
    });
  }

  onPageChange(page: number): void {
    this.fileShareState.page = page;
    this.fetchData(page);
  }
}
