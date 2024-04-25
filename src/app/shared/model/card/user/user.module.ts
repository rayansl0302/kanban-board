import { Quadro } from "../quadro/quadro.module";

export interface User {
    uid?: string | null;
    nome: string;
    email: string;
    quadro: Quadro[];

  }
  