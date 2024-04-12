export interface User {
    id?: number | null;
    nome: string;
    email: string;
    senha: string; // A senha será omitida do tipo real, apenas o e-mail será retornado
  }
  