import { Card } from "../card/card.module";

export interface Quadro {
  quadroId?: string;
  nome: string;
  cards: Card[];
  visivelParaTodos?: boolean; // Adiciona a nova propriedade
  usuarioSelecionado?: string; // Armazenando apenas o UID do usuário

}
