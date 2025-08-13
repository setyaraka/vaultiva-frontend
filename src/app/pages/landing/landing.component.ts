import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { HeroComponent } from '../../components/hero/hero.component';

@Component({
  selector: 'app-landing',
  imports: [
    NzButtonModule, 
    NzCarouselModule, 
    CommonModule,
    HeroComponent,
    RouterModule
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements AfterViewInit {
  private router = inject(Router);
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  carouselItems = [
    {
      image: 'assets/images/authentication.png',
      title: 'Secure Login with JWT Authentication',
      caption: 'Keep your account safe with token-based user authentication.'
    },
    {
      image: 'assets/images/upload-preview.png',
      title: 'Upload and Preview Your Files Instantly',
      caption: 'Drag, drop, and preview images, PDFs, and documents with ease.'
    },
    {
      image: 'assets/images/file-list.png',
      title: 'Manage Your Files with Granular Control',
      caption: 'Easily track your document visibility, download limits, and access history in one clear dashboard'
    },
    {
      image: 'assets/images/dashboard.png',
      title: 'Track Downloads & Activity in Dashboard',
      caption: 'Get real-time insights into file views and downloads.'
    }
  ];

  ngAfterViewInit(): void {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToDemo() {
    this.router.navigate(['/demo']);
  }

  scrollTo(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  goToLanding() {
    this.router.navigate(['/']);
  }
}

