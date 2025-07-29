import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { environment } from '../../../environments/environment';
import { getBase64 } from '../../shared/utils/file-utils';
import { firstValueFrom } from 'rxjs';
import { NzImageModule } from 'ng-zorro-antd/image';

interface UploadResponse {
  fileId: string;
  filename: string;
}

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzMessageModule,
    NzUploadModule,
    NzIconModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzCardModule,
    FormsModule,
    NzImageModule
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  private fb = inject(NonNullableFormBuilder);
  private http = inject(HttpClient);
  private message = inject(NzMessageService);

  form = this.fb.group({
    visibility: this.fb.control<'public' | 'private' | 'password_protected'>('private'),
    password: this.fb.control(''),
    expiresAt: this.fb.control(''),
    downloadLimit: this.fb.control<number | null>(null),
  });

  fileList: NzUploadFile[] = [];
  isLoading = false;
  lastUploadedFileId: string | null = null;
  passwordVisible = false;
  password?: string;

  visibilityOptions = [
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' },
    { value: 'password_protected', label: 'Password' }
  ];

  beforeUpload = (file: NzUploadFile): boolean => {
    this.handleFileUpload(file);
    return false;
  };

  private async handleFileUpload(file: NzUploadFile) {
    const realFile = file as unknown as File;
    if (!realFile) {
      this.message.error('File is not valid');
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('file', realFile);

    try {
      const preview = await getBase64(realFile);

      const res = await firstValueFrom(
        this.http.post<UploadResponse>(`${environment.apiUrl}/file/upload`, formData)
      );

      this.message.success(`${file.name} success uploaded!`);
      this.lastUploadedFileId = res.fileId;

      this.fileList = [
        {
          uid: res.fileId,
          name: file.name,
          status: 'done',
          url: `${environment.apiUrl}/file/preview/public/${res.fileId}`,
          thumbUrl: preview,
          response: res
        }
      ];
    } catch (error) {
      this.message.error(`${file.name} upload failed`);
    } finally {
      this.isLoading = false;
    }
  }

  isImageFile(name: string): boolean {
    return /\.(png|jpg|jpeg)$/i.test(name);
  }

  onSubmit(): void {
    if (!this.lastUploadedFileId) {
      this.message.error('Upload File First!');
      return;
    }

    const payload = {
      fileId: this.lastUploadedFileId,
      visibility: this.form.value.visibility,
      password: this.form.value.password,
      expiresAt: this.form.value.expiresAt,
      downloadLimit: this.form.value.downloadLimit
    };

    this.isLoading = true;

    this.http.patch(`${environment.apiUrl}/file/metadata`, payload).subscribe({
      next: () => {
        this.message.success('Metadata Has Been Saved!');
        this.form.reset();
        this.fileList = [];
        this.lastUploadedFileId = null;
      },
      error: () =>  {
        this.message.error('Metadata Save Failed')
        this.form.reset();
        this.fileList = [];
        this.lastUploadedFileId = null;
      },
      complete: () => this.isLoading = false
    });
  }

  onDelete(fileId: string): void {
    this.http.delete(`${environment.apiUrl}/file/${fileId}`).subscribe({
      next: () => {
        this.message.success("File Has Been Deleted!");
        this.isLoading = false;
        this.fileList = [];
      },
      error: () => {
        this.message.error("File Save Failed");
        this.isLoading = false;
      }
    })
  }
}
