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
import { environment } from '../../../environment/environment';
import { getBase64 } from '../../shared/utils/file-utils';
import { firstValueFrom } from 'rxjs';

interface UploadResponse {
  fileId: string,
  filename: string
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
    FormsModule
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  private fb = inject(NonNullableFormBuilder);
  private http = inject(HttpClient);
  private message = inject(NzMessageService);

  form = this.fb.group({
    file: this.fb.control<File | null>(null),
    visibility: this.fb.control<'public' | 'private' | 'password'>('private'),
    password: this.fb.control(''),
    expiresAt: this.fb.control(''),
    downloadLimit: this.fb.control<number | null>(null),
  });

  isLoading = false;
  visibilityOptions = [
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' },
    { value: 'password', label: 'Password' }
  ];
  fileList: NzUploadFile[] = [];

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.form.patchValue({ file });
    }
  }

  onSubmit(): void {
    if (!this.form.valid || !this.form.value.file) {
      this.message.error('Lengkapi semua input.');
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('file', this.form.value.file);
    formData.append('visibility', this.form.value.visibility || 'private');
    formData.append('password', this.form.value.password || '');
    formData.append('expiresAt', this.form.value.expiresAt || '');
    formData.append('downloadLimit', this.form.value.downloadLimit?.toString() || '');

    this.http.post(`${environment.apiUrl}/file/upload`, formData).subscribe({
      next: () => {
        this.message.success('File berhasil diupload!');
        this.form.reset();
      },
      error: () => this.message.error('Gagal upload file'),
      complete: () => this.isLoading = false
    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.handleFileUpload(file); // panggil async tanpa await
    return false; // cegah upload otomatis
  };
  
  // beforeUpload = (file: NzUploadFile): boolean => {
  //   const realFile = file as unknown as File;
  //   const formData = new FormData();

  //   this.isLoading = true;

  //   formData.append('file', realFile);

  //   const preview = await this.getBase64(file.originFileObj as File);

  //   this.http.post<UploadResponse>(`${environment.apiUrl}/file/upload`, formData).subscribe({
  //     next: (res) => {
  //       this.message.success(`${file.name} berhasil diupload!`);
  //       this.fileList = [
  //         ...this.fileList,
  //         {
  //           uid: res.fileId,
  //           name: file.name,
  //           status: 'done',
  //           url: ``,
  //           response: res, // opsional, kalau kamu mau simpan info full
  //         }
  //       ];
  //     },
  //     error: () => {
  //       this.message.error(`${file.name} gagal upload`);
  //     },
  //     complete: () => {
  //       this.isLoading = false;
  //     }
  //   })
  //   return false;
  // };
  private async handleFileUpload(file: NzUploadFile) {
    const realFile = file as unknown as File;
    
    if (!realFile) {
      this.message.error('File tidak valid.');
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
  
      this.message.success(`${file.name} berhasil diupload!`);
  
      this.fileList = [
        ...this.fileList,
        {
          uid: res.fileId,
          name: file.name,
          status: 'done',
          url: `${environment.apiUrl}/file/preview/${res.fileId}`,
          thumbUrl: preview, // kalau kamu ingin pakai thumbnail
          response: res
        }
      ];
    } catch (error) {
      this.message.error(`${file.name} gagal upload`);
    } finally {
      this.isLoading = false;
    }
  }
  

}
