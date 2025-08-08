import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FileSizePipe } from '../../file-size.pipe';

interface fileState {
  id: string,
  originalName: string,
  visibility: string,
  downloadLimit: number,
  expiresAt: string,
  size: number
}

@Component({
  selector: 'app-share-file-modal',
  imports: [
    CommonModule, 
    NzFormModule, 
    FormsModule, 
    ReactiveFormsModule,
    FileSizePipe,
  ],
  standalone: true,
  templateUrl: './share-file-modal.component.html',
  styleUrl: './share-file-modal.component.css'
})
export class ShareFileModalComponent implements OnInit {
  fileId: string = inject(NZ_MODAL_DATA).fileId;

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private message = inject(NzMessageService);
  private modalRef = inject(NzModalRef);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    expiresAt: ['', Validators.required],
    maxDownload: [1, [Validators.required, Validators.min(1)]],
    note: [''],
  })
  loading = false;
  shareUrl: string | null = null;

  fileState: fileState = {
    id: '',
    originalName: '',
    visibility: '',
    downloadLimit: 0,
    expiresAt: '',
    size: 0
  }

  ngOnInit(): void {
    this.fetchData(this.fileId);
  }

  isPdf(filename: string): boolean {
    return /\.pdf$/i.test(filename);
  }

  fetchData(id: string): void {
    this.loading = true;
    const apiUrl = `${environment.apiUrl}/file/${this.fileId}`;

    this.http.get<fileState>(apiUrl)
    .subscribe({
      next: (res) => {
        this.fileState = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  };

  onSubmit() {
    if(this.form.invalid) return;
    this.loading = true;

    const dto = {
      ...this.form.value,
      fileId: this.fileId,
    };

    this.http.post<{ shareUrl: string  }>(`${environment.apiUrl}/file/share`, dto).subscribe({
      next: (res) => {
        this.shareUrl = res.shareUrl;
        this.loading = false;
        this.message.success("Success Send Email");
      },
      error: (err) => {
        this.message.error(err.error.message);
        this.loading = false;
      },
      complete: () => this.modalRef.destroy()
    })
  }
}
