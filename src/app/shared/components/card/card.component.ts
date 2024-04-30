import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
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
import { UploadImagesComponent } from '../upload-images/upload-images.component';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnDestroy  {
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
  imageURLsSubscription: Subscription | undefined;

  imageURL: string | undefined;
  imageURLs: string[] | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private commentService: CommentsService,
    private userService: UserService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private authService: AuthService,
    private cardService: CardService,
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage

  ) {

  }

  ngOnInit() {
    this.carregarUsuarios().subscribe(() => {
      this.card = this.data.card;  // Obtendo os dados passados do componente pai
      this.quadroId = this.data.quadroId; // Obtendo o ID do quadro passado pelo componente pai
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

    if (this.imageURLsSubscription) {
      this.imageURLsSubscription.unsubscribe();
    }
  }
  ngOnDestroy() {
    // Cancela a assinatura do fluxo observável para evitar vazamentos de memória
    if (this.imageURLsSubscription) {
      this.imageURLsSubscription.unsubscribe();
    }
  }


  getCommentKeys(comments: any): string[] {
    return Object.keys(comments || {});
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
  openUploadImagemModal(): void {
    console.log('Abrindo modal de upload de imagem...');
    console.log('userId:', this.userId);
    console.log('quadroId:', this.quadroId);
    console.log('card:', this.card);
  
    const dialogRef = this.dialog.open(UploadImagesComponent, {
      width: '400px',
      data: {
        userId: this.userId,
        quadroId: this.quadroId,
        card: this.card
      }
    });
  
    // Inscreva-se para receber os dados da modal após ser fechada
    dialogRef.afterClosed().subscribe((result: string[]) => {
      console.log('A modal foi fechada');
      // Faça algo com os dados retornados pela modal
      console.log('Dados retornados:', result);
      if (result) {
        console.log('Links das imagens enviadas:', result);
        // Faça algo com os links das imagens, como atualizar a interface, etc.
      }
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
  async enviarImagem(): Promise<void> {
    try {
      if (this.userId && this.quadroId && typeof this.card.id === 'string' && this.selectedImage) {
        const cardId = this.card.id as string; // Convertendo this.card.id para string
        await this.cardService.enviarImagens(this.userId, this.quadroId, cardId, [this.selectedImage]); // Passando o arquivo em um array
        console.log('Imagem enviada com sucesso.');
        // Faça qualquer ação necessária após o envio da imagem, como atualizar a interface, etc.
      } else {
        console.error('Informações incompletas para enviar imagem.');
        // Lide com o caso em que as informações necessárias não estão disponíveis
      }
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      // Lide com o erro adequadamente, exiba uma mensagem para o usuário, etc.
    }
  }
  

  downloadImage(imageURL: string): void {
    // Cria um elemento <a> para iniciar o download da imagem
    const link = document.createElement('a');
    link.href = imageURL;

    // Define o atributo "download" para que o navegador inicie o download automaticamente
    link.download = 'image.jpg';

    // Adiciona o elemento <a> ao corpo do documento (necessário para alguns navegadores)
    document.body.appendChild(link);

    // Simula um clique no elemento <a> para iniciar o download
    link.click();

    // Remove o elemento <a> do corpo do documento após o download
    document.body.removeChild(link);
  }

  isImageURLString(): boolean {
    return typeof this.card.imageURLs === 'string';
  }

  removerImagem(imageURL: string): void {
    // Obtenha a referência do arquivo com base no URL da imagem
    const fileRef = this.storage.refFromURL(imageURL);
    
    // Exclua o arquivo do armazenamento
    fileRef.delete().subscribe(() => {
      console.log('Imagem removida com sucesso do armazenamento.');
      
      // Remova o URL da imagem do array de imageURLs
      const index = this.card.imageURLs?.indexOf(imageURL);
      if (index !== undefined && index !== -1) {
        this.card.imageURLs?.splice(index, 1); // Remove o URL da imagem do array
      }
  
      // Mostra um alerta de sucesso
      window.alert('Imagem excluída com sucesso.');
  
      // O array imageURLs do cartão foi atualizado, e a interface do usuário será atualizada automaticamente
    }, error => {
      console.error('Erro ao remover imagem do armazenamento:', error);
      // Lidar com o erro adequadamente, exibir mensagem para o usuário, etc.
    });
  }
  
  
  isValidImageURL(imageURL: string): boolean {

    return true;
  }
}
