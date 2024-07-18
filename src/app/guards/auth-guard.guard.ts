import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../service/auth/auth.service';

export const authGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const  router:Router=inject(Router);
  
  const protectedRoutes:string[]=["/calendar"];
  
  return authService.isAuthenticated().pipe(map((loggedIn: boolean) => {
    if (protectedRoutes.includes(state.url) && !loggedIn) {
      router.navigate(["/login"]);
      return false;
    }
    return true;
  }));
};
