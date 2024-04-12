import { Card } from "../card/card/card.module";

export interface QuadroDetalhes {
  id?: number | null;
  nome: string;
  cards: Card[];
}