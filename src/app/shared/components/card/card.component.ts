import { Component, Inject, Input, OnInit } from '@angular/core';
import { Card } from '../../model/card/card/card.module';
import { User } from '../../model/card/user/user.module';
import { MatDialog } from '@angular/material/dialog';
import { EditCardModalComponent } from '../edit-card/edit-card-modal.component';
import { Comment } from '../../model/comment/comment.model';
import { DatePipe } from '@angular/common';
import { CriarComentarioComponent } from '../criar-comentario/criar-comentario.component';
import { AssignedTo } from '../../model/assigned/assignedto.module';
import { Observable, Subscription, map, of, switchMap, tap } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../services/auth-service/auth-service.service';
import { CommentsService } from '../../services/comments-service/comments.service';
import { UserService } from '../../services/user-service/user.service';
import { CardService } from '../../services/card-service/card.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() quadroId: string | undefined;
  userId: string | undefined;
  currentCard: Card | null = null;
  users: User[] = [];
  isLoading = false;
  card!: Card;
  comments!: Observable<Comment[]>; // Adicionando um Observable para os comentários
  userUid: string | null = localStorage.getItem('userUid');
  formCard!: FormGroup; // Definindo formCard como um FormGroup
  showImageUpload: boolean = false;
  selectedImage: File | null = null; // Adicionando controle para a imagem selecionada
  images: File[] = []; // Array para armazenar as imagens selecionadas

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private commentService: CommentsService,
    private userService: UserService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private authService: AuthService,
    private cardService: CardService,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit() {
    this.carregarUsuarios().subscribe(() => {
      this.card = this.data.card;  // Obtendo os dados passados do componente pai
      this.quadroId = this.data.quadroId; // Obtendo o ID do quadro passado pelo componente pai
      console.log('Card recebido no CardComponent:', this.card);
      console.log('ID DO Card recebido no CardComponent:', this.card.id);
      console.log('ID do quadro recebido no CardComponent:', this.quadroId);
      console.log('Data do card recebida:', this.card?.dueDate);
      console.log('user id no component card ', this.userId) // Corrigido para userId
      // Carregar os comentários do cartão
      this.comments = this.commentService.getComments(
        this.userId || '', // Usando userId em vez de ''
        this.quadroId ? this.quadroId.toString() : '',
        this.card.id ? this.card.id.toString() : ''
      );
    });

    this.formCard = this.formBuilder.group({
      images: [[]] // Inicializando o campo de imagens como um array vazio
    });
  }
  onFileSelected(event: any): void {
    const files: FileList = event.target.files; // Obtendo a lista de arquivos selecionados
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file: File = files.item(i)!; // Obtendo cada arquivo da lista
        this.images.push(file); // Adicionando o arquivo ao array de imagens
      }
    }
  }

  getCommentKeys(comments: any): string[] {
    return Object.keys(comments || {});
  }

  toggleImageUpload(): void {
    this.showImageUpload = !this.showImageUpload; // Alternando entre verdadeiro e falso
  }
  getCommentAuthor(comment: Comment): string {
    const user = this.users.find(user => user.email === comment.author);
    return user ? user.nome : 'Autor desconhecido';
  }

  formatDate(date: any): string {
    if (date) {
      return this.datePipe.transform(new Date(date), 'medium') || '';
    } else {
      return '';
    }
  }


  carregarUsuarios(): Observable<void> {
    return this.authService.getAuthState().pipe(
      switchMap(user => {
        if (user) {
          // Define o userId apenas se o usuário estiver autenticado
          const userId = localStorage.getItem('uid');
          if (userId) {
            this.userId = userId; // Defina o userId
            return this.userService.getUsers().pipe(
              tap(users => {
                if (Array.isArray(users)) {
                  this.users = users;
                } else {
                  this.users = [];
                }
                this.isLoading = false;
              }),
              map(() => { })
            );
          }
        }
        // Retorna um observable vazio se o usuário não estiver autenticado ou se não houver um UID no localStorage
        return of();
      })
    );
  }

  openEditModal() {
    this.dialog.open(EditCardModalComponent, {
      width: '400px',
      data: { card: this.card }
    });
  }

  openModalcomentario(card: Card): void {
    if (!this.userId) {
      console.error('UID do usuário não encontrado.');
      return;
    }

    const dialogRef = this.dialog.open(CriarComentarioComponent, {
      width: '90%',
      data: {
        card: card, // Passando o objeto Card para o modal
        quadroId: this.quadroId, // Passando o ID do quadro para o modal
        cardId: card.id, // Passando o ID do card para o modal
        userId: this.userId // Passando o UID do usuário para o modal
      }
    });
  }

  removerCard(cardId: string | null | undefined) {
    console.log('userUid:', this.userId); // Corrigido para userId
    console.log('quadroId:', this.quadroId);
    console.log('cardId:', cardId);

    if (this.userId && this.quadroId && cardId) {
      this.cardService.deleteCard(this.userId, this.quadroId, cardId).then(
        () => console.log('Card removido com sucesso. ID:', cardId),
        error => console.error('Erro ao remover card. ID:', cardId, 'Erro:', error)
      );
    } else {
      console.error('ID do card, userId ou quadroId não estão definidos:', cardId, this.userId, this.quadroId); // Corrigido para userId
    }
  }

  getUserName(assignedTo: AssignedTo): string {
    if (assignedTo) {
      console.log('Procurando usuário com UID:', assignedTo.uid);
      const user = this.users.find(u => u.uid === assignedTo.uid);
      if (user) {
        console.log('Usuário encontrado:', user.email, user.nome, user.uid);
        return user.email;
      } else {
        console.log('Usuário não encontrado para o UID:', assignedTo.uid);
        return 'E-mail não encontrado';
      }
    } else {
      console.log('assignedTo é undefined');
      return 'Atribuído a não especificado';
    }
  }

  getCommentIds(card: Card): string[] {
    return Object.keys(card.comments || {});
  }

  deleteComment(commentId: string) {
    const userId = this.userId || ''; // Corrigido para userId
    const quadroId = this.quadroId || ''; // Corrigido para quadroId
    const cardId = this.card.id?.toString() || ''; // Convertendo para string

    this.commentService.deleteComment(userId, quadroId, cardId, commentId).then(
      () => console.log('Comentário removido com sucesso.'),
      error => console.error('Erro ao remover comentário:', error)
    );
  }

  async addCommentToCard(userId: string, quadroId: string, cardId: string, comment: Comment) {
    try {
      console.log('Adicionando comentário ao card...');
      await this.commentService.addComment(userId, quadroId, cardId, comment);
      console.log('Comentário adicionado com sucesso!');
      // Exibir mensagem de sucesso para o usuário, atualizar a interface, etc.
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      // Exibir mensagem de erro para o usuário, lidar com o erro adequadamente, etc.
    }
  }

  // enviarImagem(): void {
  //   if (this.selectedImage) {
  //     const userId = this.userId || '';
  //     const quadroId = this.quadroId || '';
  //     const cardId = this.card.id || '';

  //     this.cardService.uploadImage(userId, quadroId, cardId, this.selectedImage).then(() => {
  //       console.log('Imagem enviada com sucesso.');
  //       // Atualizar a lista de imagens carregadas
  //       const image = { name: this.selectedImage.name, url: 'caminho/para/sua/pasta/' + this.selectedImage.name };
  //       this.images.push(image);
  //       // Limpar a imagem selecionada
  //       this.selectedImage = null;
  //       // Esconder o campo de upload de imagem
  //       this.showImageUpload = false;
  //     }).catch(error => {
  //       console.error('Erro ao enviar imagem:', error);
  //     });
  //   } else {
  //     console.warn('Nenhuma imagem selecionada.');
  //   }
  // }

}
