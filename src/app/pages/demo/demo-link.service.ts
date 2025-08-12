import { Injectable } from '@angular/core';
// import { DemoFile } from './demo-files';

export type ExpiryPreset = '1h' | '24h' | '3d' | '7d' | 'custom';
export type Visibility = 'Public' | 'Restricted';

export interface DemoPolicy {
  fileId: string;
  passwordEnabled: boolean;
  password: string;                // demo default: "1234"
  expiryEnabled: boolean;          // always true for demo
  expiresAt: string;               // ISO string
  limitEnabled: boolean;
  downloadLimit: number;
  downloadCount: number;
  visibility: Visibility;
}

export interface DemoLink {
  slug: string;
  policy: DemoPolicy;
}

@Injectable({ providedIn: 'root' })
export class DemoLinkService {
  key(slug: string) { return `demo:${slug}`; }

  save(link: DemoLink) {
    sessionStorage.setItem(this.key(link.slug), JSON.stringify(link));
  }

  load(slug: string): DemoLink | null {
    const raw = sessionStorage.getItem(this.key(slug));
    return raw ? JSON.parse(raw) as DemoLink : null;
  }

  update(slug: string, updater: (l: DemoLink) => void) {
    const link = this.load(slug);
    if (!link) return;
    updater(link);
    this.save(link);
  }

  generateSlug(len = 7) {
    return Math.random().toString(36).slice(2, 2 + len);
  }

  computeExpiresAt(preset: ExpiryPreset, custom?: Date) {
    const base = new Date();
    const d = new Date(base);
    switch (preset) {
      case '1h':  d.setHours(d.getHours() + 1); break;
      case '24h': d.setDate(d.getDate() + 1); break;
      case '3d':  d.setDate(d.getDate() + 3); break;
      case '7d':  d.setDate(d.getDate() + 7); break;
      case 'custom': d.setTime(custom?.getTime() ?? d.getTime()); break;
    }
    return d.toISOString();
  }
}
