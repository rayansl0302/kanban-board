import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../services/firestore-service/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private firestoreService: FirestoreService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.loginForm.controls; }

  fazerLogin(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.f['email'].value;
    const senha = this.f['senha'].value;

    this.authService.fazerLogin(email, senha).subscribe(logado => {
      if (logado) {
        this.router.navigateByUrl('/home');
      } else {
        alert('Erro: Usuário não encontrado');
      }
    });
  }
}
