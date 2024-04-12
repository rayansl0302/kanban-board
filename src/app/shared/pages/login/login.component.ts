import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string = '';
  senha: string = '';
  emailValido: boolean = false;
  senhaValida: boolean = false;
  emailDirty: boolean = false;
  senhaDirty: boolean = false;
  emailTouched: boolean = false;
  senhaTouched: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('LoginComponent: Inicializado');
    // Verificar se o usuário está autenticado ao carregar o componente
    if (this.authService.isUsuarioAutenticado()) {
      console.log('LoginComponent: Usuário autenticado, redirecionando para a página home');
      this.router.navigateByUrl('/home');
    }
  }

  fazerLogin(): void {
    console.log('LoginComponent: Fazendo login...');
    // Obtém os parâmetros da rota
    const email = this.email;
    const senha = this.senha;
  
    // Verifica se o email e a senha foram fornecidos
    if (email && senha) {
      console.log('LoginComponent: Email e senha fornecidos');
      this.authService.fazerLogin(email, senha).subscribe(logado => {
        if (logado) {
          // Se o login for bem-sucedido, redireciona para a página home
          console.log('LoginComponent: Login bem-sucedido, redirecionando para a página home');
          console.log('LocalStorage após o login:', localStorage);
          console.log('SessionStorage após o login:', sessionStorage);
          this.router.navigateByUrl('/home');
        } else {
          // Se o login falhar, exibe um alerta com a mensagem de erro
          console.log('LoginComponent: Login falhou, exibindo mensagem de erro');
          alert('Erro: Usuário não encontrado');
        }
      });
    } else {
      // Se o email e a senha não forem fornecidos, exibe um alerta com a mensagem de erro
      console.log('LoginComponent: Email e/ou senha não fornecidos, exibindo mensagem de erro');
      alert('Erro: Email e/ou senha não fornecidos');
    }
  }
  
}
