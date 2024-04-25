import { AuthService } from './../../services/auth-service/auth-service.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Card } from '../../model/card/card/card.module';
import { Checklist } from '../../model/checklist/checklist.module';
import { CardService } from '../../services/card-service/card.service';
import { UserService } from '../../services/user-service/user.service';
import { User } from '../../model/card/user/user.module';
import { Observable, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss']
})
export class CardDetailsComponent implements OnInit {
  @Input() card!: Card;
  @Input() quadroId: string | undefined;
  @Input() userId: string | undefined;
  showChecklist = false;
  checklist: Checklist[] = [];
  users: User[] = []; // Adicionando declaração da propriedade users

  checklistForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private cardService: CardService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.checklistForm = this.formBuilder.group({
      novoItem: ['', Validators.required]
    });

    // Carrega os usuários e define o userId se disponível no localStorage
    this.carregarUsuarios().subscribe(() => {
      // Verifica se o userId está definido e o exibe ou registra um erro se não estiver
      if (this.userId) {
        console.log('UID do usuário recuperado do localStorage:', this.userId);
      } else {
        console.error('UID do usuário não encontrado no localStorage.');
      }
    });

    // Carrega o checklist do cartão se disponível
    if (this.card && this.card.checklist) {
      this.checklist = this.card.checklist;
    }
  }
  carregarUsuarios(): Observable<void> {
    return this.authService.getAuthState().pipe(
      switchMap(user => {
        if (user) {
          // Define o userId apenas se o usuário estiver autenticado
          const userId = localStorage.getItem('userId');
          if (userId) {
            this.userId = userId; // Defina o userId
            return this.userService.getUsers().pipe(
              tap(users => {
                if (Array.isArray(users)) {
                  this.users = users;
                } else {
                  this.users = [];
                }
              }),
              map(() => { })
            );
          }
        }
        // Retorna um observable vazio se o usuário não estiver autenticado ou se não houver um UID no localStorage
        return of();
      })
    );
  }


  adicionarItemChecklist(): void {
    if (this.checklistForm.valid) {
      const newItem: Checklist = {
        id: this.generateUniqueId(),
        title: this.checklistForm.value.novoItem,
        completed: false
      };
      console.log('Novo item do checklist:', newItem); // Adicionando console.log
      this.checklist.push(newItem);
      console.log('Checklist após adicionar item:', this.checklist); // Adicionando console.log
      this.checklistForm.reset();
    }
  }

  removerItemChecklist(item: Checklist): void {
    const index = this.checklist.indexOf(item);
    if (index !== -1) {
      this.checklist.splice(index, 1);
    }
  }

  salvarChecklist(): void {
    if (!this.userId) {
      console.error('ID do usuário não especificado.');
      return;
    }

    if (this.card && this.checklist.length > 0) {
      if (this.card.id && this.card.quadroId) {
        const cardId: string = this.card.id.toString();
        console.log('Dados para salvar checklist:', {
          userId: this.userId,
          quadroId: this.card.quadroId,
          cardId: cardId,
          checklist: this.checklist
        }); // Adicionando console.log
        this.cardService.updateCardChecklist(this.userId, this.card.quadroId, cardId, this.checklist)
          .then(() => console.log('Checklist salvo com sucesso!'))
          .catch(error => console.error('Erro ao salvar o checklist:', error));
      } else {
        console.error('ID do card ou quadro não especificado.');
      }
    }
    this.showChecklist = false;
  }

  cancelarAdicaoChecklist(): void {
    this.showChecklist = false;
    this.checklistForm.reset();
  }

  generateUniqueId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}
