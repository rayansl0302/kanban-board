import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth-service.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.afAuth.authState.pipe(
      take(1),
      map(user => {
        const isAuthenticated = !!user;
        if (!isAuthenticated) {
          this.router.navigateByUrl('/login');
        }
        return isAuthenticated;
      })
    );
  }
}
