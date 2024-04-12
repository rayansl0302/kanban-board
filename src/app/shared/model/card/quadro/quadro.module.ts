import { Card } from "../card/card.module";

export interface Quadro {
  id?: number | null;
  nome: string;
  cards: Card[];
}
