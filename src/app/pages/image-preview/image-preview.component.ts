import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NZ_MODAL_DATA, NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-image-preview',
  imports: [
    CommonModule,
    NzModalModule
  ],
  standalone: true,
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.css'
})
export class ImagePreviewComponent {
  url: string = inject(NZ_MODAL_DATA).url;
  alt: string = inject(NZ_MODAL_DATA).alt;
}
