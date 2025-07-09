import { Routes } from '@angular/router';
import { LayoutDefaultComponent } from './layout/layout-default/layout-default.component';
import { LayoutPassportComponent } from './layout/layout-passport/layout-passport.component';


export const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  // { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) },
  // { path: 'login', loadChildren: () => import('./pages/login/login.routes').then((m) => m.LOGIN_ROUTES) }
  {
    path: '',
    component: LayoutDefaultComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/welcome' },
      {
        path: 'welcome',
        loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES)
      },
      // {
      //   path: 'dashboard',
      //   loadChildren: () => import('./pages/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      // }
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
