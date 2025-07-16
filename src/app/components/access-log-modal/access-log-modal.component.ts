import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { environment } from '../../../environment/environment';
import { formatDateToShort, formatTime } from '../../core/utils/date';
import { UserAgentParserPipe } from '../../core/pipes/user-agent-parser.pipe';
import { NzMessageService } from 'ng-zorro-antd/message';

interface AccessLog {
  accessedAt: string;
  ipAddress: string;
  userAgent: string;
  status: string;
  reason?: string;
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
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);

  fileId: string = inject(NZ_MODAL_DATA).fileId;
  http = inject(HttpClient);

  formatDate = formatDateToShort;
  formatTime = formatTime;

  isLoading = false;
  activeTab = 'fileLog';

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
    limit: 5,
    totalPages: 0
  }

  ngOnInit(): void {
    this.fetchLogs(1, false);
  }

  fetchLogs(page: number, isFailed: boolean): void {
    this.isLoading = true;
    const fileLogAPI = `${environment.apiUrl}/file/download/${this.fileId}/access-logs`
    const failedLogAPI = `${environment.apiUrl}/file/download/${this.fileId}/failed-logs`

    this.http.get<any>(isFailed ? failedLogAPI : fileLogAPI, {
      params: {
        page: page.toString(),
        limit: this.dataSet.limit.toString()
      }
    }).subscribe({
      next: (res) => {
        this.dataSet = res;
      },
      error: () => {
        this.message.error('Data Not Found');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  
  onPageChange(page: number): void {
    this.dataSet.page = page;
    const selectedLog = this.activeTab === "fileLog" ? false : true;
    this.fetchLogs(page, selectedLog);
  }

  handleClose(){
    this.modalRef.destroy();
  }

  setActiveTab(tabId: string) {
    const selectedLog = tabId === "fileLog" ? false : true;
    if(this.activeTab !== tabId){
      this.fetchLogs(1, selectedLog);
    }
    this.activeTab = tabId;
  }
}
