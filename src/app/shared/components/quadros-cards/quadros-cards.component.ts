import { Component, Input, OnInit } from '@angular/core';
import { Quadro } from '../../model/card/quadro/quadro.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirestoreService } from '../../services/firestore-service/firestore.service';
import { Card } from '../../model/card/card/card.module';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importe AngularFireAuth

@Component({
  selector: 'app-quadros-cards',
  templateUrl: './quadros-cards.component.html',
  styleUrls: ['./quadros-cards.component.scss']
})
export class QuadrosCardsComponent implements OnInit {
  @Input() quadroDetalhes: Quadro | undefined = undefined;

  
  quadros: Quadro[] = [];

  selectedQuadroId: number | null = null;
  selectedQuadro: Quadro | null = null;
  formCard!: FormGroup;

  selectedLabels: string[] = ['Urgente', 'Normal', 'Sem Prazo (A definir)'];
  usuarios: any[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private firestoreService: FirestoreService,
    private afAuth: AngularFireAuth // Injete AngularFireAuth
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.carregarUsuarios();
    this.carregarQuadros();
  }

  createForm(): void {
    this.formCard = this.formBuilder.group({
      id: [null],
      title: [null],
      description: [null],
      assignedTo: [null],
      labels: [null],
      comments: [null],
    });
  }

  onSubmit(): void {
    if (!this.selectedQuadroId) {
      alert('Selecione um quadro antes de criar o card.');
      return;
    }

    const quadroId = this.selectedQuadroId;
    const cardData = this.formCard.value;

    this.firestoreService.createCard(quadroId, cardData).then(() => {
      alert('Cartão criado!');
      location.reload();
    }).catch(error => {
      console.error('Erro ao criar o card:', error);
    });
  }

  carregarUsuarios(): void {
    // Carregue os usuários utilizando o serviço Firestore
    this.firestoreService.getUsers().subscribe(usuarios => {
      this.usuarios = usuarios;
    }, error => {
      console.error('Erro ao carregar os usuários:', error);
    });
  }
  
  carregarQuadros(): void {
    // Obtenha o ID do usuário atualmente autenticado
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // Converte o ID do usuário para número, se necessário
        const userId = Number(user.uid);
  
        // Carregue os quadros do usuário utilizando o serviço Firestore
        this.firestoreService.getUserBoards(userId).subscribe(quadros => {
          this.quadros = quadros;
        }, error => {
          console.error('Erro ao carregar os quadros:', error);
        });
      }
    });
  }

  onSelectQuadro(): void {
    console.log('Selected Quadro ID:', this.selectedQuadroId);
    if (this.selectedQuadroId) {
      this.selectedQuadro = this.quadros.find(quadro => quadro.id === this.selectedQuadroId) || null;
    } else {
      this.selectedQuadro = null;
    }
  }

  editarCard(card: Card): void {
    if (typeof card.id === 'string') {
      this.firestoreService.updateCard(card.id, card).then(() => {
        alert('Card atualizado!');
      }).catch(error => {
        console.error('Erro ao editar o card:', error);
      });
    } else {
      console.error('ID do card inválido:', card.id);
    }
  }

  carregarDetalhesQuadro(quadroId: number): void {
    this.firestoreService.getQuadro(quadroId).subscribe(quadro => {
      this.quadroDetalhes = quadro; // Aqui atribuímos o quadroDetalhes, que deve ser do tipo Quadro | undefined
    }, error => {
      console.error('Erro ao carregar os detalhes do quadro:', error);
    });
  }
  
  // removerCard(cardId: string): void {
  //   this.firestoreService.deleteCard(cardId).then(() => {
  //     alert('Card removido!');
  //   }).catch(error => {
  //     console.error('Erro ao remover o card:', error);
  //   });
  // }
}
