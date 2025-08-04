import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-hero',
  imports: [LottieComponent, CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  standalone: true
})
export class HeroComponent {
  options: AnimationOptions = {
    path: '/assets/animations/data_security.json',
  }

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }
}
