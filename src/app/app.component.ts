import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth-service/auth-service.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  usuarioAutenticado: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Verifica a autenticação ao inicializar o componente
    console.log('AppComponent: Verificando autenticação...');
    this.verificarAutenticacao();
  }
  
  // Verifica se o usuário está autenticado
  verificarAutenticacao(): void {
    // Obtém o estado de autenticação do serviço AuthService
    const auth$: Observable<boolean> = this.authService.afAuth.authState.pipe(
      map(user => !!user)
    );
  
    // Inscreva-se no Observable para obter o valor booleano
    auth$.subscribe(auth => {
      console.log('LocalStorage - Autenticação:', auth);
  
      // Se estiver autenticado, redireciona para a página "home"
      if (auth) {
        console.log('Usuário autenticado, redirecionando para a página de home...');
        this.router.navigateByUrl('/home');
      } else {
        // Se não estiver autenticado, redireciona para a página de login
        console.log('AppComponent: Usuário não autenticado, redirecionando para a página de login...');
        this.router.navigateByUrl('/login');
      }
    });
  }
}
