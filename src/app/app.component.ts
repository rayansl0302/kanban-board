import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth-service/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  usuarioAutenticado: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
  }

  verificarAutenticacao(): void {
    console.log('AppComponent: Verificando autenticação...');
    // Obtém o estado de autenticação do serviço AuthService
    const auth = this.authService.isUsuarioAutenticado();
    const username = this.authService.obterNomeUsuario();
    console.log('LocalStorage - Autenticação:', auth);
    console.log('LocalStorage - Nome de usuário:', username);

    if (auth) {
      this.usuarioAutenticado = true;
      console.log('AppComponent: Usuário autenticado');
    } else {
      console.log('AppComponent: Usuário não autenticado, redirecionando para a página de login...');
      this.router.navigateByUrl('/login');
    }
  }
}
