import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from '../../model/card/card/card.module';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private baseUrl = 'http://localhost:3000/cards';

  constructor(private http: HttpClient) { }

  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>(this.baseUrl);
  }
  updateCardState(cardId: number, newState: string): Observable<Card> {
    const url = `${this.baseUrl}/${cardId}/state`; // Exemplo de URL da API para atualizar o estado do cartão
    return this.http.put<Card>(url, { estado: newState }); // Faz uma requisição HTTP PUT para atualizar o estado do cartão
  }
  criarCard(card: Card): Observable<Card> {
    const url = `${this.baseUrl}`;
    return this.http.post<Card>(url, card);
  }

  editarCard(card: Card): Observable<Card> {
    const url = `${this.baseUrl}/${card.id}`;
    return this.http.put<Card>(url, card);
  }

  removerCard(cardId: string): Observable<void> {
    const url = `${this.baseUrl}/${cardId}`;
    return this.http.delete<void>(url);
  }

  getCard(cardId: string): Observable<Card> { 
    const url = `${this.baseUrl}/${cardId}`;
    return this.http.get<Card>(url);
  }
}
