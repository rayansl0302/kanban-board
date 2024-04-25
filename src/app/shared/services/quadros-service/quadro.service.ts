import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, map, of, switchMap } from 'rxjs';
import { Quadro } from '../../model/card/quadro/quadro.module';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Card } from '../../model/card/card/card.module';

@Injectable({
  providedIn: 'root'
})

export class QuadroService {

  constructor(private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
  ) { }

  getUserBoards(userId?: string): Observable<Quadro[]> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        const uid = userId || (user ? user.uid : null);
        if (uid) {
          return this.db.object<any>(`users/${uid}/quadro`).valueChanges().pipe(
            map(quadros => {
              return Object.keys(quadros).map(key => ({ id: key, ...quadros[key] }));
            })
          );
        } else {
          return of([]);
        }
      })
    );
  }

  getQuadro(quadroId: string): Observable<Quadro | undefined> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db.object<any>(`users/${user.uid}/quadro/${quadroId}`).valueChanges();
        } else {
          return of(undefined);
        }
      })
    );
  }

  getBoards(): Observable<any[]> {
    return this.db.list('boards').valueChanges();
  }

  getCardsByBoard(boardId: string): Observable<Card[]> {
    return this.db.list<Card>(`boards/${boardId}/cards`).valueChanges();
  }

  createQuadro(userId: string, novoQuadro: Quadro): Promise<string> {
    return this.db.list(`users/${userId}/quadro`).push(novoQuadro)
      .then((ref) => {
        const quadroId = ref.key;
        if (quadroId) {
          console.log('Quadro criado com sucesso. ID:', quadroId);
          // Atualiza o quadro com o ID gerado
          return this.db.object(`users/${userId}/quadro/${quadroId}`).update({ ...novoQuadro, quadroId: quadroId, cards: [{ placeholder: true }] })
            .then(() => quadroId);
        } else {
          throw new Error('Falha ao obter o ID do quadro recém-criado.');
        }
      })
      .catch((error) => {
        console.error('Erro ao criar o quadro:', error);
        throw error;
      });
  }

  updateQuadro(quadroId: string, quadro: Quadro): Promise<void> {
    return this.db.object<Quadro>(`quadros/${quadroId}`).update(quadro);
  }

  deleteQuadro(quadroId: string): Promise<void> {
    return this.db.object<Quadro>(`quadros/${quadroId}`).remove();
  }

}
