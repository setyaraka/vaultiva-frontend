import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { DemoLinkService } from '../demo/demo-link.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd/message';
import { demoFiles } from '../demo/demo-files';

@Component({
  selector: 'app-demo-preview',
  imports: [
    CommonModule, 
    FormsModule, 
    NzCardModule, 
    NzButtonModule, 
    NzInputModule, 
    NzAlertModule
  ],
  templateUrl: './demo-preview.component.html',
  styleUrl: './demo-preview.component.css'
})
export class DemoPreviewComponent implements OnInit {

  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private svc = inject(DemoLinkService);
  private sanitizer = inject(DomSanitizer);
  private msg = inject(NzMessageService);

  link = signal(this.svc.load(this.route.snapshot.paramMap.get('slug') || ''));
  file = computed(() => {
    const id = this.link()?.policy.fileId;
    return demoFiles.find(f => f.id === id) || null;
  });

  passwordInput = '';
  wrong = signal(false);
  authed = signal(false);

  ngOnInit(): void {
    if (this.needPassword() === false) this.authed.set(true);
  }

  needPassword() { return !!this.link()?.policy.passwordEnabled; }
  expiresAt() { return new Date(this.link()!.policy.expiresAt); }
  expiresAtLocal() { return this.expiresAt().toLocaleString(); }
  expired() { return new Date() > this.expiresAt(); }

  limitEnabled() { return !!this.link()?.policy.limitEnabled; }
  downloadsLeft() {
    const p = this.link()!.policy;
    return Math.max(0, (p.downloadLimit || 0) - (p.downloadCount || 0));
  }
  limitReached() { return this.limitEnabled() && this.downloadsLeft() <= 0; }

  safeUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.file()!.url);
  }

  checkPassword() {
    this.wrong.set(false);
    const ok = this.passwordInput === (this.link()!.policy.password || '1234');
    if (ok) this.authed.set(true);
    else this.wrong.set(true);
  }

  simulateDownload() {
    const slug = this.link()!.slug;
    if (this.limitReached()) return;
    this.svc.update(slug, l => { l.policy.downloadCount += 1; });
    this.link.set(this.svc.load(slug));
    this.msg.success('Downloaded (simulated)');
  }

  centerGate(): boolean {
    return !!this.link() && !this.expired() && this.needPassword() && !this.authed();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToLanding() {
    this.router.navigate(['/']);
  }

  expiresIn() {
    const ms = this.expiresAt().getTime() - Date.now();
    if (ms <= 0) return 'expired';
    const m = Math.round(ms/60000), h = Math.round(m/60), d = Math.round(h/24);
    return m < 60 ? `${m} min` : h < 48 ? `${h} hours` : `${d} days`;
  }
}
