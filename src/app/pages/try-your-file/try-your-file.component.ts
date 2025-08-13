import { Component, inject, OnDestroy } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { WatermarkService } from '../demo/watermark.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-try-your-file',
  imports: [
    NzAlertModule, 
    CommonModule,
    NzSpinModule
  ],
  templateUrl: './try-your-file.component.html',
  styleUrl: './try-your-file.component.css'
})
export class TryYourFileComponent implements OnDestroy {
  private modalRef = inject(NzModalRef<TryYourFileComponent>);
  private wm = inject(WatermarkService);
  private sanitizer = inject(DomSanitizer);

  busy = false;
  errorMsg = '';
  isPdf = false;
  objectUrl: string | null = null;
  safePreviewUrl: SafeResourceUrl | null = null;

  async onFileSelected(ev: Event) {
    this.errorMsg = '';
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Validasi
    const okType = /^(image\/(png|jpeg)|application\/pdf)$/.test(file.type);
    if (!okType) { this.errorMsg = 'Only PDF, PNG, or JPG are supported.'; return; }
    if (file.size > 10 * 1024 * 1024) { this.errorMsg = 'Max file size is 10 MB.'; return; }

    try {
      this.busy = true;
      if (file.type.startsWith('image/')) {
        this.isPdf = false;
        const blob = await this.wm.watermarkImage(file);
        if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = URL.createObjectURL(blob);
      } else {
        this.isPdf = true;
        const blob = await this.wm.watermarkPdf(file, 'DEMO · Vaultiva', 10);
        // beri nama .pdf agar viewer aktif di semua browser
        const f = new File([blob], 'preview.pdf', { type: 'application/pdf' });
        if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = URL.createObjectURL(f);
      }
      this.safePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl!);
    } catch (e: any) {
      this.errorMsg = e?.message || 'Failed to process file.';
    } finally {
      this.busy = false;
      (ev.target as HTMLInputElement).value = ''; // reset supaya bisa pilih file yang sama lagi
    }
  }

  close() {
    this.modalRef.close();
  }

  ngOnDestroy() {
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
  }
}
