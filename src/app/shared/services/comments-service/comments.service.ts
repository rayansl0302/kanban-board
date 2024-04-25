import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Comment } from '../../model/comment/comment.model'; // Importar o modelo de comentário

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private db: AngularFireDatabase) { }

  getComments(userId: string, quadroId: string, cardId: string): Observable<Comment[]> {
    return this.db.list<Comment>(`users/${userId}/quadro/${quadroId}/cards/${cardId}/comments/`).valueChanges();
  }
  deleteComment(userId: string, quadroId: string, cardId: string, commentId: string): Promise<void> {
    return this.db.object<Comment>(`users/${userId}/quadro/${quadroId}/cards/${cardId}/comments/${commentId}`).remove();
  }

  async addComment(userId: string, quadroId: string, cardId: string, comment: Comment): Promise<void> {
    try {
      const commentId = await this.generateCommentId(userId, quadroId, cardId);
      const timestamp = new Date().toISOString();

      const newComment: Comment = {
        id: commentId,
        author: comment.author,
        content: comment.content || '',
        timestamp: timestamp
      };

      await this.db.object<Comment>(`users/${userId}/quadro/${quadroId}/cards/${cardId}/comments/${commentId}`).set(newComment);
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      throw error;
    }
  }

  async generateCommentId(userId: string, quadroId: string, cardId: string): Promise<string> {
    const commentIdRef = this.db.list(`users/${userId}/quadro/${quadroId}/cards/${cardId}/comments`).push(null);
    return commentIdRef.key || '';
  }
}
