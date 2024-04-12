import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth-service.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('auth guard aq',this.authService.isUsuarioAutenticado())
    if (this.authService.isUsuarioAutenticado()) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
