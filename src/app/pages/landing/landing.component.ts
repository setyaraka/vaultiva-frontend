import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';

@Component({
  selector: 'app-landing',
  imports: [NzButtonModule, NzCarouselModule, CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  carouselReady = false;

  array = ["Mantap", "Jika", 3, 4];
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
}

