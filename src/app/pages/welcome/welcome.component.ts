import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzGridModule,
    NzSpinModule
  ]
})
export class WelcomeComponent implements OnInit {
  private http = inject(HttpClient);
  private message = inject(NzMessageService);

  isLoading = false;

  stats = {
    totalFiles: 0,
    expiredFiles: 0,
    privateFiles: 0,
    publicFiles: 0,
    passwordProtectedFiles: 0,
    totalDownloads: 0,
  };

  ngOnInit() {
    this.fetchStats();
  }

  fetchStats() {
    this.isLoading = true;
    this.http.get<any>(`${environment.apiUrl}/file/me/stats`).subscribe({
      next: (res) => {
        this.stats = res;
      },
      error: () => {
        this.message.error("Failed Get Statistic Data")
      },
      complete: () => this.isLoading = false
    });
  }
}
