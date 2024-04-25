import { Quadro } from './../../model/card/quadro/quadro.module';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth-service/auth-service.service';
import { User } from '../../model/card/user/user.module';
import { MatSelectChange } from '@angular/material/select';
import { QuadroService } from '../../services/quadros-service/quadro.service';
import { UserService } from '../../services/user-service/user.service';

@Component({
  selector: 'app-criar-quadro-dialog',
  templateUrl: './criar-quadro-dialog.component.html',
  styleUrls: ['./criar-quadro-dialog.component.scss']
})
export class CriarQuadroDialogComponent implements OnInit {
  criarQuadroForm!: FormGroup;
  nomeQuadro = '';
  visivelParaTodos = false;
  usuarios: User[] = [];
  usuarioSelecionado = '';
  user: User | null = null;

  constructor(
    public dialogRef: MatDialogRef<CriarQuadroDialogComponent>,
    private authService: AuthService,
    private quadroService: QuadroService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.criarQuadroForm = this.formBuilder.group({
      nomeQuadro: ['', Validators.required],
      visivelParaTodos: [false],
      usuarioSelecionado: [''],
      cardsInicializados: [{ value: true, disabled: true }] // Campo desabilitado, sempre retornando true para inicializar os cards
    });
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.userService.getUsers().subscribe((usuarios: User[]) => {
      console.log('Usuários recuperados:', usuarios);
      this.usuarios = usuarios || [];

      for (const usuario of this.usuarios) {
        console.log('UID do usuário:', usuario.uid);
      }
    }, error => {
      console.error('Erro ao carregar os usuários:', error);
    });
  }



  cancelar(): void {
    this.dialogRef.close();
  }

  onSelectUser(event: MatSelectChange): void {
    const userId = event.value;
    console.log('ID do usuário selecionado:', userId);
    if (userId) {
      this.criarQuadroForm.patchValue({ usuarioSelecionado: userId }); // Atribuindo o UID do usuário selecionado ao FormGroup
      this.user = this.usuarios.find(user => user.uid === userId) || null;
      console.log('Usuário selecionado:', this.user);
    } else {
      this.user = null;
      console.log('Nenhum usuário selecionado.');
    }
  }

  criarQuadro(): void {
    const currentUser = this.authService.afAuth.currentUser;
    if (currentUser) {
      currentUser.then(user => {
        if (user && user.uid) {
          const userId = user.uid;
          if (this.criarQuadroForm.valid) {
            const novoQuadro: Quadro = {
              nome: this.criarQuadroForm.value.nomeQuadro,
              cards: [{
                quadroId: '',
                title: '',
                description: '',
                assignedTo: null,
                labels: [],
                dueDate: null,
                comments: [],
                isExpanded: false,
                estado: '',
                afazer: false,
                backlog: false,
                emAndamento: false,
                feito: false
              }],
              visivelParaTodos: this.criarQuadroForm.value.visivelParaTodos,
              usuarioSelecionado: this.criarQuadroForm.value.usuarioSelecionado
            };

            this.quadroService.createQuadro(userId, novoQuadro).then(() => {
              alert('Quadro criado com sucesso!');
              this.dialogRef.close();
            }).catch(error => {
              console.error('Erro ao criar o quadro:', error);
            });
          } else {
            alert('Por favor, insira um nome para o quadro.');
          }
        } else {
          console.error('Usuário não autenticado.');
        }
      }).catch(error => {
        console.error('Erro ao obter o usuário atual:', error);
      });
    }
  }

}