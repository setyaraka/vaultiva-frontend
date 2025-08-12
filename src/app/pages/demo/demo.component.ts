import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { demoFiles, DemoFile } from './demo-files';
import { DemoLinkService, ExpiryPreset, DemoLink } from './demo-link.service';
import { NzTagModule } from 'ng-zorro-antd/tag';

// ng-zorro
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { DemoBannerComponent } from './demo-banner.component';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    NzCardModule, NzButtonModule, NzFormModule, NzInputModule,
    NzSwitchModule, NzRadioModule, NzInputNumberModule,
    NzDatePickerModule, NzStepsModule, DemoBannerComponent,
    NzTagModule
  ],
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent {

  private fb = inject(FormBuilder);
  private svc = inject(DemoLinkService);
  private router = inject(Router);
  private msg = inject(NzMessageService);

  step = signal(0); // 0: choose, 1: protect, 2: link
  allFiles: DemoFile[] = demoFiles;
  selected = signal<DemoFile | null>(null);

  form = this.fb.group({
    passwordEnabled: [true],
    password: ['1234', [Validators.minLength(3)]],
    expiryPreset: ['24h' as ExpiryPreset, [Validators.required]],
    expiryCustom: [null as Date | null],
    limitEnabled: [true],
    downloadLimit: [2, [Validators.min(1), Validators.max(10)]],
    visibility: ['Restricted']
  });

  link = signal<DemoLink | null>(null);
  linkUrl = computed(() => this.link() ? `/demo/${this.link()!.slug}` : '');

  selectFile(f: DemoFile) {
    this.selected.set(f);
    this.step.set(1);
  }

  generateLink() {
    const f = this.form.value;
    const file = this.selected();
    if (!file) { this.msg.error('Select a file first'); return; }

    // validations
    if (f.passwordEnabled && !f.password) { this.msg.error('Password is required'); return; }
    if (f.expiryPreset === 'custom' && !f.expiryCustom) { this.msg.error('Pick a custom expiry'); return; }
    if (f.limitEnabled && (!f.downloadLimit || f.downloadLimit < 1)) { this.msg.error('Invalid download limit'); return; }

    const slug = this.svc.generateSlug();
    const expiresAt = this.svc.computeExpiresAt(f.expiryPreset!, f.expiryCustom!);
    const link: DemoLink = {
      slug,
      policy: {
        fileId: file.id,
        passwordEnabled: !!f.passwordEnabled,
        password: f.password || '1234',
        expiryEnabled: true,
        expiresAt,
        limitEnabled: !!f.limitEnabled,
        downloadLimit: f.limitEnabled ? (f.downloadLimit ?? 2) : 0,
        downloadCount: 0,
        visibility: (f.visibility as any) ?? 'Restricted'
      }
    };
    this.svc.save(link);
    this.link.set(link);
    this.step.set(2);
    this.msg.success('Demo link generated');
  }

  copyLink() {
    if (!this.linkUrl()) return;
    navigator.clipboard.writeText(location.origin + this.linkUrl());
    this.msg.success('Link copied');
  }

  openPreview() {
    if (this.link()) this.router.navigate(['/demo', this.link()!.slug]);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToLanding() {
    this.router.navigate(['/']);
  }

  backToFiles() { this.step.set(0); this.selected.set(null); }
}
