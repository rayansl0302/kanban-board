import { Comment } from '../../comment/comment.model';
import { AssignedTo } from '../../assigned/assignedto.module';
import { Data } from '../../data/data.model';
import { Checklist } from '../../checklist/checklist.module';
export interface Card {
  id?: number | string | null;
  title: string;
  description: string;
  quadroId: string;
  assignedTo?: AssignedTo | null;// Lista de IDs de usuários atribuídos ao card
  dueDate: Data | null; // Usando o modelo de data
  labels: string[]; // Lista de etiquetas associadas ao card
  comments: Comment[]; // Lista de comentários
  isExpanded?: boolean; // Adiciona a propriedade isExpanded
  estado?: string; // Adiciona a propriedade estado
  afazer?: boolean; // Indica se está na categoria "A fazer"
  backlog?: boolean; // Indica se está na categoria "Backlog"
  emAndamento?: boolean; // Indica se está na categoria "Em Andamento"
  feito?: boolean; // Indica se está na categoria "Feito"
  checklist?: Checklist[] | null;
  imageURLs?: string[]; 
}
