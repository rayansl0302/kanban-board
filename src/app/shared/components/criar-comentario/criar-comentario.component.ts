import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../../model/comment/comment.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../model/card/user/user.module';
import { CommentsService } from '../../services/comments-service/comments.service';
import { UserService } from '../../services/user-service/user.service';
@Component({
  selector: 'app-criar-comentario',
  templateUrl: './criar-comentario.component.html',
  styleUrls: ['./criar-comentario.component.scss']
})
export class CriarComentarioComponent {
  commentForm!: FormGroup;
  quadroId: string | undefined;
  card: any;
  users: User[] = [];
  uid: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private commentService: CommentsService,
    private userService: UserService,
        @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.card = data.card;
    this.quadroId = data.quadroId;
    this.uid = localStorage.getItem('uid') ?? undefined; // Obtendo o UID do usuário do localStorage
    this.createCommentForm();
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.userService.getUsers().subscribe(users => {
      if (Array.isArray(users)) {
        this.users = users;
      } else {
        this.users = [];
      }
    });
  }

  createCommentForm(): void {
    this.commentForm = this.formBuilder.group({
      content: ['', Validators.required],
    });
  }

  async onSubmit(): Promise<void> {
    console.log('Formulário válido:', this.commentForm.valid);
    console.log('ID do card:', this.card.id);
    console.log('ID do quadro:', this.quadroId);
    console.log('UID do usuário:', this.uid);

    if (this.commentForm.valid && this.card && this.card.id && this.quadroId && this.uid) {
      const commentContent = this.commentForm.get('content')?.value;

      const comment: Partial<Comment> = {
        author: '', // O autor será definido como o e-mail vinculado ao UID do usuário
        content: commentContent,
        timestamp: new Date().toISOString()
      };

      try {
        // Obtém o e-mail vinculado ao UID do usuário
        const currentUser = this.users.find(user => user.uid === this.uid);
        if (currentUser && currentUser.email) {
          comment.author = currentUser.email;
          console.log('E-mail vinculado ao UID do usuário:', currentUser.email);
        }

        // Gera o ID automaticamente
        const commentId = await this.commentService.generateCommentId(this.uid, this.quadroId, this.card.id);

        // Adiciona o comentário usando o serviço Firebase
        const commentData: Comment = { ...comment, id: commentId, author: comment.author || '', content: comment.content || '', timestamp: comment.timestamp || '' };
        await this.commentService.addComment(this.uid, this.quadroId, this.card.id, commentData);
        console.log('Comentário adicionado com sucesso! ID:', commentId);
        // Exibe um alerta de "Comentário adicionado com sucesso"
        alert('Comentário adicionado com sucesso!');

        this.commentForm.reset();
      } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
      }
    } else {
      console.error('Formulário inválido ou IDs não disponíveis.');
    }
  }

}
