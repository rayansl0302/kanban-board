import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private afDatabase: AngularFireDatabase,
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.setItem('user', 'null');
      }
    });
  }

  get logado(): boolean {
    const usuarioLogado = JSON.parse(localStorage.getItem('user')!);
    return usuarioLogado !== null;
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      localStorage.setItem('uid', result.user?.uid || '');
      localStorage.setItem('email', result.user?.email || '');
    } catch (error) {
      throw error;
    }
  }

  logout(): Promise<void> {
    localStorage.removeItem('uid');
    localStorage.removeItem('email');
    return this.afAuth.signOut()
      .then(() => {
        this.router.navigate(['login']);
      });
  }
  

  getUsers(): Observable<any[]> {
    // Retorna um Observable que representa uma lista de usuários do Firebase Realtime Database
    return this.afDatabase.list('users').valueChanges();
  }

  // Adicione este método para retornar o estado de autenticação
  getAuthState(): Observable<any> {
    return this.afAuth.authState;
  }
  async getUidByEmail(email: string): Promise<string | null> {
    try {
      const userCredential = await this.afAuth.fetchSignInMethodsForEmail(email);
      if (userCredential && userCredential[0]) {
        return userCredential[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao obter UID pelo e-mail:', error);
      return null;
    }
  }
}
