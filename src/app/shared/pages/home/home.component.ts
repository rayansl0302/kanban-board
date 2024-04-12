import { Component, OnInit } from '@angular/core';
import { Quadro } from '../../model/card/quadro/quadro.module';
import { QuadroService } from '../../services/quadro-service/quadro-service.service';
import { QuadroDetalhes } from '../../model/quadro-detalhes/quadro-detalhes.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Card } from '../../model/card/card/card.module';
import { CardService } from '../../services/card-service/card-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  quadros: Quadro[] = [];
  selectedQuadroId: Number | null = null;
  quadroDetalhesList: any[] = [];

  quadroDetalhes: QuadroDetalhes | null = null; // Alteração aqui

  constructor(private quadroService: QuadroService, private cardService: CardService) { }

  ngOnInit(): void {
    this.carregarQuadros();
  }

  carregarQuadros(): void {
    this.quadroService.getQuadros().subscribe((quadros: Quadro[]) => {
      this.quadros = quadros;
    });
  }

  carregarDetalhesQuadro(quadro: Quadro): void {
    if (!quadro || quadro.id == null) {
      return;
    }
    this.quadroService.getQuadroDetalhes(quadro.id).subscribe(
      (quadroDetalhes: QuadroDetalhes) => {
        this.quadroDetalhes = quadroDetalhes;
      },
      (error) => {
        console.error('Erro ao carregar detalhes do quadro:', error);
        this.quadroDetalhes = null;
      }
    );
  }
// Método para mover um card entre as colunas
drop(event: CdkDragDrop<Card[]>, column: string) {
  const movedCard = event.container.data[event.currentIndex];
  movedCard.estado = column; // Atualiza o estado do cartão para a coluna de destino
  this.updateCardState(movedCard, column); // Chama o serviço para atualizar o estado do cartão no backend
}

// Método para atualizar o estado do cartão no backend
updateCardState(card: Card, column: string): void {
  if (card && card.id && column) {
    this.cardService.updateCardState(card.id, column).subscribe(
      updatedCard => {
        console.log('Estado do cartão atualizado com sucesso:', updatedCard);
        // Aqui você pode atualizar o estado do cartão na interface do usuário, se necessário
      },
      error => {
        console.error('Erro ao atualizar o estado do cartão:', error);
      }
    );
  } else {
    console.error('ID do cartão ou nova coluna não especificados.');
  }
}
getCardsByEstado(estado: string): Card[] {
  return this.quadroDetalhes?.cards.filter(card => card.estado === estado) ?? [];
}

}
