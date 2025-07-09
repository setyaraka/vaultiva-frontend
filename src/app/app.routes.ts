import { Routes } from '@angular/router';
import { LayoutDefaultComponent } from './layout/layout-default/layout-default.component';
import { LayoutPassportComponent } from './layout/layout-passport/layout-passport.component';
import { authGuard } from './core/guards/auth.guard';


export const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivateChild: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/welcome' },
      {
        path: 'welcome',
        loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES)
      },
    ]
  },
  {
    path: 'login',
    component: LayoutPassportComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/login/login.routes').then(m => m.LOGIN_ROUTES)
      }
    ]
  }
];
