import { UserService } from '../../services/user-service/user.service';
import { QuadroService } from '../../services/quadros-service/quadro.service';
import { CardService } from '../../services/card-service/card.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CardComponent } from '../../components/card/card.component';
import { Card } from '../../model/card/card/card.module';
import { Quadro } from '../../model/card/quadro/quadro.module';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  quadros: Quadro[] = [];
  selectedQuadro: Quadro | null = null; // Corrigido para selectedQuadro
  quadroDetalhes: Quadro | null = null;
  cards: Card[] = [];
  cardsTeste: any = [];
  loading: boolean = true;
  userId: string | null = null; // Adicionando userId
  cardsAfazer: string[] = [];
  cardsAndamento: string[] = [];
  cardsFeito: string[] = [];
  constructor(
    private userService: UserService,
    private quadroService: QuadroService,
    private cardService: CardService,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.carregarQuadros();
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid; // Obtendo o UID do usuário atual
      }
    });
  }

  drop(event: any) {
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }


  openCardModal(titulo: string): void {
    let card:any = this.cards.filter((card)=>{
      if(card.title == titulo){
        return card
      }
      else{
        return
      }
    })
    
    card = card[0]

    if (card.dueDate) {
      console.log('Data do card clicado:', card.dueDate);
    } else {
      console.warn('A data do card clicado não está definida.');
    }

    if (!this.userId) {
      console.error('UID do usuário não encontrado.');
      return;
    }

    const dialogRef = this.dialog.open(CardComponent, {
      width: '99%',
      data: {
        card: card,
        quadroId: this.selectedQuadro?.quadroId,
        userId: this.userId // Passando o UID do usuário para a modal
      }
    });
  }

  carregarQuadros(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.quadroService.getUserBoards(user.uid).subscribe((quadros: Quadro[]) => {
          this.quadros = quadros;
          this.loading = false;
        }, error => {
          console.error('Erro ao carregar os quadros:', error);
          this.loading = false;
        });
      }
    });
  }

  carregarDetalhesQuadro(quadro: Quadro): void {
    this.selectedQuadro = quadro;

    if (!quadro || !quadro.quadroId) {
      console.error('ID do quadro não especificado.');
      return;
    }
    const quadroId = quadro.quadroId.toString();
    this.quadroService.getQuadro(quadroId).subscribe(
      (quadroDetalhes: Quadro | undefined) => {
        if (quadroDetalhes) {
          this.quadroDetalhes = quadroDetalhes;
          this.cards = quadroDetalhes.cards ? Object.values(quadroDetalhes.cards) : [];
          this.cards.shift();
          this.cardsTeste = this.cards.map((card) => { return card.title}
        );
        } else {
          console.error('Detalhes do quadro não encontrados.');
          this.quadroDetalhes = null;
          this.cards = [];
        }
      },
      (error) => {
        console.error('Erro ao carregar detalhes do quadro:', error);
        this.quadroDetalhes = null;
        this.cards = [];
      }
    );
  }

  updateCardState(card: Card, column: string, userId: string, quadroId: string): void {
    if (card && card.id && column && userId && quadroId) {
      try {
        this.cardService.updateCard(userId, quadroId, String(card.id), column).then(() => {
          console.log('Estado do cartão atualizado com sucesso.');
        }).catch(error => {
          console.error('Erro ao atualizar o estado do cartão:', error);
        });
      } catch (error) {
        console.error('Erro ao atualizar o estado do cartão:', error);
      }
    } else {
      console.error('Alguma propriedade do cartão não está definida.');
    }
  }

  getCardsByEstado(estado: string): Card[] {
    return this.cards.filter(card => card.estado === estado);
  }
}
