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
      {
        path: 'upload',
        loadChildren: () => import('./pages/upload/upload.routes').then(m => m.UPLOAD_ROUTES)
      },
      {
        path: 'my-files',
        loadChildren: () => import('./pages/my-files/my-files.routes').then(m => m.MY_FILES_ROUTES)
      }
    ]
  },
  {
    path: 'preview/:id',
    loadChildren: () => import('./pages/file-preview/file-preview.routes').then(m => m.FILE_PREVIEW_ROUTES)
  },
  {
    path: 'password-page/:id',
    loadChildren: () => import('./pages/password-page/password-page.routes').then(m => m.PASSWORD_PAGE_ROUTES)
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
