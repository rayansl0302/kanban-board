import { Component, Input } from '@angular/core';
import { Card } from '../../model/card/card/card.module';
import { CardService } from '../../services/card-service/card-service.service';
import { UserService } from '../../services/user-service/user.service';
import { User } from '../../model/card/user/user.module';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  @Input() card!: Card;
  users: User[] = [];

  constructor(private cardService: CardService, private userService: UserService) { }

  ngOnInit() {
    this.carregarUsuarios();
  }

  toggleCardExpansion(card: Card) {
    card.isExpanded = !card.isExpanded; // Alternar o estado de expansão apenas para o card clicado
  }

  carregarUsuarios() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  getUserName(userId: number): string {
    const user = this.users.find(user => user.id === userId);
    if (user) {
      return `${user.nome} (${user.email})`;
    } else {
      return 'Usuário não encontrado';
    }
  }

  editarCard(card: Card) {
    if (card.id !== null && card.id !== undefined) {
      const cardId = typeof card.id === 'number' ? card.id.toString() : card.id;
      if (!isNaN(parseInt(cardId, 10))) {
        this.cardService.editarCard(card).subscribe(
          () => console.log('Card editado com sucesso:', card),
          error => console.error('Erro ao editar card:', error)
        );
      } else {
        console.error('ID do card inválido:', cardId);
      }
    } else {
      console.error('ID do card não está definido:', card.id);
    }
  }

  removerCard(cardId: number | string | null | undefined) {
    if (typeof cardId === 'number' || typeof cardId === 'string') {
      const parsedCardId = typeof cardId === 'number' ? cardId.toString() : cardId;
      if (!isNaN(parseInt(parsedCardId, 10))) {
        this.cardService.removerCard(parsedCardId).subscribe(
          () => console.log('Card removido com sucesso. ID:', parsedCardId),
          error => console.error('Erro ao remover card. ID:', parsedCardId, 'Erro:', error)
        );
      } else {
        console.error('ID do card inválido:', cardId);
      }
    } else {
      console.error('ID do card não está definido ou não é um número/string:', cardId);
    }
  }
}
