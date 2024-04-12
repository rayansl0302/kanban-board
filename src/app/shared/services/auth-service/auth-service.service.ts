import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'user_authenticated';
  private usuarioAutenticado: boolean = false;
  private nomeUsuario: string = '';

  constructor(private http: HttpClient) {
    this.verificarAutenticacao();
    console.log(this.usuarioAutenticado)
  }

  private verificarAutenticacao(): void {
    if (typeof localStorage !== 'undefined') {
        const auth = localStorage.getItem(this.STORAGE_KEY);
      if (auth === 'true') {
        this.usuarioAutenticado = true;
      }
    }
  }
  

  fazerLogin(email: string, senha: string): Observable<boolean> {
    return this.http.get<any[]>('http://localhost:3000/usuarios', { params: { email, senha } })
      .pipe(
        map((usuarios: any[]) => {
          const usuarioEncontrado = usuarios.find(usuario => usuario.email === email && usuario.senha === senha);
          if (usuarioEncontrado) {
            localStorage.setItem(this.STORAGE_KEY, 'true');
            this.usuarioAutenticado = true;
            this.nomeUsuario = usuarioEncontrado.nome;
            return true;
          } else {
            return false;
          }
        }),
        catchError(() => {
          return of(false);
        })
      );
  }
  

  fazerLogout(): void {
    this.usuarioAutenticado = false;
    this.nomeUsuario = '';
    localStorage.removeItem(this.STORAGE_KEY); // Trocando de localStorage para localStorage
  }

  obterNomeUsuario(): string {
    return this.nomeUsuario;
  }

  isUsuarioAutenticado(): boolean {
    return this.usuarioAutenticado;
  }
}
