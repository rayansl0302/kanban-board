import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioAutenticado: boolean = false;
  private nomeUsuario: string = '';
  private readonly STORAGE_KEY = 'user_authenticated';

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe(user => {
      this.usuarioAutenticado = !!user;
      this.nomeUsuario = user?.displayName || '';
    });
  }

  fazerLogin(email: string, senha: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.afAuth.signInWithEmailAndPassword(email, senha)
        .then(() => {
          localStorage.setItem(this.STORAGE_KEY, 'true');
          observer.next(true);
          observer.complete();
        })
        .catch(error => {
          console.error('Erro ao fazer login:', error);
          observer.next(false);
          observer.complete();
        });
    });
  }

  fazerLogout(): Observable<void> {
    return new Observable<void>(observer => {
      this.afAuth.signOut()
        .then(() => {
          localStorage.removeItem(this.STORAGE_KEY); // Remover do local storage
          observer.next();
          observer.complete();
          this.router.navigateByUrl('/login'); // Redirecionar para a página de login
        })
        .catch(error => {
          console.error('Erro ao fazer logout:', error);
          observer.error(error);
        });
    });
  }

  obterNomeUsuario(): string {
    return this.nomeUsuario;
  }

  isUsuarioAutenticado(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      observer.next(this.usuarioAutenticado);
      observer.complete();
    });
  }  
}
