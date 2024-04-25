import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';
import { Card } from '../../model/card/card/card.module';
import { Data } from '../../model/data/data.model';
import { Comment } from '../../model/comment/comment.model';
import { Checklist } from '../../model/checklist/checklist.module';
@Injectable({
  providedIn: 'root'
})
export class CardService {
  private selectedCardSubject = new Subject<Card>();
  selectedCard: BehaviorSubject<Card | null> = new BehaviorSubject<Card | null>(null);

  constructor(private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,) { }

  // Métodos para cartões /////////////////////////////////////////////////////////////////////

  getBoardCards(quadroId: string): Observable<Card[]> {
    return this.db.list<Card>(`quadros/${quadroId}/cards`).valueChanges();
  }
  async createCard(userId: string, quadroId: string, card: Card, comment: Comment): Promise<{ cardId: string; dueDate: Data; }> {
    try {
      const cardId = await this.generateCardId(quadroId);

      // Adicionando o ID do card ao objeto card
      card.id = cardId;
      // Adicionando o quadroId ao card
      card.quadroId = quadroId;

      card.checklist = []; // Inicializa o checklist como um array vazio

      // Verifica se dueDate é uma string e converte-a para o modelo de data, se necessário
      if (typeof card.dueDate === 'string') {
        const dateParts = (card.dueDate as string).split('-').map(Number);
        if (dateParts.length === 3) {
          const [year, month, day] = dateParts;
          card.dueDate = { day, month, year };
        } else {
          throw new Error('Formato de data inválido.');
        }
      }

      // Se card.dueDate ainda for nulo após a conversão, atribua um valor de placeholder
      if (!card.dueDate) {
        card.dueDate = { day: 1, month: 1, year: 1970 }; // placeholder
      }

      const cardRef = this.db.object(`users/${userId}/quadro/${quadroId}/cards/${cardId}`);
      await cardRef.set(card);

      // Chame updateQuadroCardsArray apenas uma vez após a criação do card
      await this.updateQuadroCardsArray(userId, quadroId, cardId, card.dueDate);

      // Retorne o cardId e a data armazenada
      return { cardId, dueDate: card.dueDate };
    } catch (error) {
      console.error('Erro ao criar o card:', error);
      throw error;
    }
  }

  async generateCardId(quadroId: string): Promise<string> {
    const cardIdRef = this.db.list(`users/${quadroId}/cards`).push(null);
    return cardIdRef.key || '';
  }

  async updateQuadroCardsArray(userId: string, quadroId: string, cardId: string, dueDate: Data): Promise<void> {
    try {
      const quadroCardsRef = this.db.object(`users/${userId}/quadro/${quadroId}/cards`);
      const cardsArraySnapshot = await quadroCardsRef.valueChanges().pipe(take(1)).toPromise();
      const cardsArray = cardsArraySnapshot ? Object.values(cardsArraySnapshot) : [];

      // Verificando se o card já existe no array
      const existingCardIndex = cardsArray.findIndex((card: any) => card.id === cardId);
      if (existingCardIndex !== -1) {
        console.log('O card já existe no array de cards do quadro.');
        return;
      }

      // Adicionando o novo card ao array de cards
      const newData = [...cardsArray, { id: cardId }];
      await quadroCardsRef.update({ cards: newData, dueDate }); // Atualizando o array de cards e a data

      console.log('Array de cards do quadro atualizado com sucesso.');
    } catch (error) {
      console.error('Erro ao atualizar o array de cards do quadro:', error);
      throw error;
    }
  }


  async updateCard(userId: string, quadroId: string, cardId: string, column: string): Promise<void> {
    try {
      const cardRef = this.db.object(`users/${userId}/quadro/${quadroId}/cards/${cardId}`);
      await cardRef.update({ estado: column });
      console.log('Estado do cartão atualizado com sucesso.');
    } catch (error) {
      console.error('Erro ao atualizar o estado do cartão:', error);
      throw error;
    }
  }

  setSelectedCard(card: Card): void {
    console.log('Card selecionado:', card);
    this.selectedCard.next(card);
  }
  getSelectedCard() {
    return this.selectedCardSubject.asObservable();
  }

  deleteCard(userId: string, quadroId: string, cardId: string): Promise<void> {
    return this.db.object<Card>(`users/${userId}/quadro/${quadroId}/cards/${cardId}`).remove()
      .then(() => {
        console.log('Cartão excluído com sucesso.');
      })
      .catch(error => {
        console.error('Erro ao excluir o cartão:', error);
        throw error;
      });
  }


  updateCardChecklist(userId: string, quadroId: string, cardId: string, checklist: Checklist[]): Promise<void> {
    return this.db.object(`users/${userId}/quadro/${quadroId}/cards/${cardId}/checklist`).update(checklist);
  }

  async uploadImage(userId: string, quadroId: string, cardId: string, file: File): Promise<void> {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const imageURL = reader.result as string;
        await this.updateCardImageURL(userId, quadroId, cardId, imageURL);
      };
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  }

  private updateCardImageURL(userId: string, quadroId: string, cardId: string, imageURL: string): void {
    try {
      const cardRef = this.db.object(`users/${userId}/quadro/${quadroId}/cards/${cardId}`);
      cardRef.update({ imageURL }); // Atualiza o card com a URL da imagem
    } catch (error) {
      console.error('Erro ao atualizar o URL da imagem no card:', error);
      throw error;
    }
  }
}
