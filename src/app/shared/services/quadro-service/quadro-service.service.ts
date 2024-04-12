import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Quadro } from '../../model/card/quadro/quadro.module';
import { QuadroDetalhes } from '../../model/quadro-detalhes/quadro-detalhes.model';
import { Card } from '../../model/card/card/card.module';

@Injectable({
  providedIn: 'root'
})
export class QuadroService {
  private baseUrl = 'http://localhost:3000/quadros';
  id$ = new Subject;
  public quadroSelecionado$ = new Subject<Quadro>(); // Subject para emitir o quadro selecionado
  quadroSelecionadoObservable$ = this.quadroSelecionado$.asObservable(); // Observable para que os componentes possam se inscrever

  constructor(private http: HttpClient) { }
  
  selecionarQuadro(quadro: Quadro): void {
    this.quadroSelecionado$.next(quadro); // Emite o quadro selecionado para todos os inscritos
  }
  

  getQuadros(): Observable<Quadro[]> {
    return this.http.get<Quadro[]>(this.baseUrl);
  }

  getQuadro(id: string): Observable<Quadro> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Quadro>(url);
  }

  getQuadroDetalhes(id: number): Observable<QuadroDetalhes> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<QuadroDetalhes>(url);
  }

  criarQuadro(quadro: Quadro): Observable<Quadro> {
    return this.http.post<Quadro>(this.baseUrl, quadro);
  }

  editarQuadro(quadro: Quadro): Observable<Quadro> {
    const url = `${this.baseUrl}/${quadro.id}`;
    return this.http.put<Quadro>(url, quadro);
  }

  removerQuadro(quadroId: string): Observable<void> {
    const url = `${this.baseUrl}/${quadroId}`;
    return this.http.delete<void>(url);
  }

  adicionarCardAoQuadro(novoCard: Card): Observable<void> {
    const url = `${this.baseUrl}/${novoCard.id}`;
    return this.http.post<void>(url, novoCard);
  }

  removerCardDoQuadro(quadroId: string, cardId: string): Observable<void> {
    const url = `${this.baseUrl}/${quadroId}/cards/${cardId}`;
    return this.http.delete<void>(url);
  }

}
