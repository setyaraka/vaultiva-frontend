import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isTokenExpired } from '../utils/token';
import { NzMessageService } from 'ng-zorro-antd/message';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem("token");
  const message = inject(NzMessageService);

  if(token && !isTokenExpired(token)) {
    return true;
  } else {
    localStorage.removeItem("token");
    message.warning("Session expired. Please log in again.");
    router.navigateByUrl("/login");
    return false;
  }
};
