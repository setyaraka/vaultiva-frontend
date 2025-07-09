import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AuthService } from '../../core/services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-layout-default',
  standalone: true,
  imports: [
    RouterOutlet,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule
  ],
  templateUrl: './layout-default.component.html',
  styleUrl: './layout-default.component.css'
})
export class LayoutDefaultComponent {
  isCollapsed = false;

  constructor (
    private authService: AuthService,
    private message: NzMessageService
  ) {}

  logout() {
    this.authService.logout();
    this.message.success('Logout Success')
  }
}
