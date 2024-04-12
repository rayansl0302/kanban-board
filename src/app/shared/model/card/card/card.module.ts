export interface Card {
  id?: number | null;
  title: string;
  description: string;
  assignedTo: number[]; // Lista de IDs de usuários atribuídos ao card
  dueDate?: Date;
  labels: string[]; // Lista de etiquetas associadas ao card
  comments: Comment[]; // Lista de comentários
  isExpanded?: boolean; // Adiciona a propriedade isExpanded
  estado?: string; // Adiciona a propriedade estado
}
export interface Comment {
  id?: number | null;
  author: string; // ID do autor do comentário
  content: string;
  timestamp: Date;
}
