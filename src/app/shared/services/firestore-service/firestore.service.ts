import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, filter, map } from 'rxjs';
import { Quadro } from '../../model/card/quadro/quadro.module';
import { Card } from '../../model/card/card/card.module';
import { User } from '../../model/card/user/user.module';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  getUsers(): Observable<User[]> {
    return this.firestore.collection<User>('users').valueChanges();
  }

 
  getUser(uid: string): Observable<User> {
    return this.firestore.doc<User>(`users/${uid}`).valueChanges().pipe(
      filter(user => !!user),
      map(user => user as User)
    );
  }

  getUserBoards(userId: number): Observable<Quadro[]> {
    return this.firestore.collection<Quadro>(`users/${userId}/boards`).valueChanges();
  }

  getQuadro(quadroId: number): Observable<Quadro | undefined> {
    return this.firestore.doc<Quadro>(`quadros/${quadroId}`).valueChanges();
  }

  async createQuadro(userId: number, quadro: Quadro): Promise<void> {
    await this.firestore.collection<Quadro>(`users/${userId}/boards`).add(quadro);
  }

  updateQuadro(quadroId: number, quadro: Quadro): Promise<void> {
    const { id, ...quadroData } = quadro; // Remove o ID do objeto para não ser atualizado junto
    return this.firestore.doc<Quadro>(`quadros/${quadroId}`).update(quadroData);
  }

  deleteQuadro(quadroId: number): Promise<void> {
    return this.firestore.doc<Quadro>(`quadros/${quadroId}`).delete();
  }

  getBoardCards(quadroId: number): Observable<Card[]> {
    return this.firestore.collection<Card>(`boards/${quadroId}/cards`).valueChanges();
  }

  async createCard(quadroId: number, card: Card): Promise<void> {
    await this.firestore.collection<Card>(`boards/${quadroId}/cards`).add(card);
  }

  updateCard(cardId: number, card: Card): Promise<void> {
    const { id, ...cardData } = card;
    return this.firestore.doc<Card>(`cards/${cardId}`).update(cardData);
  }

  deleteCard(cardId: number): Promise<void> {
    return this.firestore.doc<Card>(`cards/${cardId}`).delete();
  }
}
