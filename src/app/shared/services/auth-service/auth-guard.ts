import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth-service.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators'; // Importar map e take do pacote rxjs

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isUsuarioAutenticado().pipe( // Usar pipe para encadear operadores
      take(1), // take(1) garante que a observação seja cancelada após a primeira emissão
      map(usuarioAutenticado => {
        if (usuarioAutenticado) {
          return true; // Retornar true se o usuário estiver autenticado
        } else {
          this.router.navigateByUrl('/login');
          return false; // Retornar false se o usuário não estiver autenticado
        }
      })
    );
  }
}
