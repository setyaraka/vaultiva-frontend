import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { environment } from '../../../environment/environment';
import { formatDateToShort, formatTime } from '../../core/utils/date';
import { UserAgentParserPipe } from '../../core/pipes/user-agent-parser.pipe';

interface AccessLog {
  accessedAt: string;
  ipAddress: string;
  userAgent: string;
  status: string;
}

@Component({
  selector: 'app-access-log-modal',
  imports: [
    NzModalModule, 
    NzDividerModule, 
    NzTableModule,
    CommonModule,
    UserAgentParserPipe
  ],
  standalone: true,
  templateUrl: './access-log-modal.component.html',
  styleUrl: './access-log-modal.component.css'
})
export class AccessLogModalComponent implements OnInit {
  fileId: string = inject(NZ_MODAL_DATA).fileId;
  private modalRef = inject(NzModalRef);
  http = inject(HttpClient);

  formatDate = formatDateToShort;
  formatTime = formatTime;

  isLoading = false;

  dataSet: {
    data: AccessLog[],
    total: number,
    page: number,
    limit: number,
    totalPages: number
  } = {
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  }

  ngOnInit(): void {
    this.fetchLogs();
  }

  fetchLogs(page: number = 1): void {
    this.isLoading = true;

    this.http.get<any>(`${environment.apiUrl}/file/download/${this.fileId}/access-logs`, {
      params: {
        page: page.toString(),
        limit: this.dataSet.limit.toString()
      }
    }).subscribe({
      next: (res) => {
        console.log(res, ">>> RESPONSE")
        this.dataSet = res;
      },
      error: () => {
        // bisa pakai messageService kalau mau
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  
  onPageChange(page: number): void {
    this.dataSet.page = page;
    this.fetchLogs(page);
  }

  handleClose(){
    this.modalRef.destroy();
  }
}
