import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-demo-banner',
  standalone: true,
  imports: [RouterModule, NzButtonModule],
  template: `
    <div
      class="max-w-6xl mx-auto px-4 mt-2 mb-4
             bg-[#F9F9F4] border border-gray-200 text-gray-700
             rounded-lg flex items-center justify-between gap-3"
    >
      <div class="py-2">
        <div class="font-medium">Demo Mode</div>
        <div class="text-sm">
          This demo uses dummy files with persistent watermarks.
          No signup, no real uploads.
        </div>
      </div>

      <a *ngIf="showStartNew" routerLink="/demo">
        <button nz-button nzType="default">Start a new demo</button>
      </a>
    </div>
  `
})
export class DemoBannerComponent {
  @Input() showStartNew = false; // true hanya di /demo/:slug
}
