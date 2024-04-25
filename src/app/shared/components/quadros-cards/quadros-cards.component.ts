import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { UserService } from '../../services/user-service/user.service';
import { QuadroService } from '../../services/quadros-service/quadro.service';
import { CardService } from '../../services/card-service/card.service';
import { Quadro } from '../../model/card/quadro/quadro.module';
import { Card } from '../../model/card/card/card.module';
import { User } from '../../model/card/user/user.module';
import { Comment } from '../../model/comment/comment.model';
import { Data } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-quadros-cards',
  templateUrl: './quadros-cards.component.html',
  styleUrls: ['./quadros-cards.component.scss']
})

export class QuadrosCardsComponent implements OnInit {
  @Input() quadroDetalhes: Quadro | undefined = undefined;
  quadros: Quadro[] = [];
  selectedQuadroId: string | null = null;
  selectedQuadro: Quadro | null = null;
  formCard!: FormGroup;
  user: User | null = null;
  selectedLabels: string[] = ['Urgente', 'Normal', 'Sem Prazo (A definir)'];
  usuarios: User[] = [];
  userId: string | null = null;
  quadroId: string | null = null; // Definindo quadroId como uma string ou null
  selectedImage: File | null = null; // Adicionando controle para a imagem selecionada

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private quadroService: QuadroService,
    private cardService: CardService,
    @Inject(MAT_DIALOG_DATA) public data: { quadroId: string }
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.carregarUsuarios();
    this.userId = localStorage.getItem('uid'); // Obter o ID do usuário do localStorage
    const quadroId = this.data.quadroId;

    if (this.userId) {
      this.carregarQuadros();
    } else {
      console.error('ID do usuário não encontrado no localStorage.');
    }
  }


  createForm(): void {
    this.formCard = this.formBuilder.group({
      id: [null],
      title: [''],
      quadroId: [''],
      description: [''],
      assignedTo: [null],
      dueDate: [null],
      labels: [[]],
      comments: [''],
      estado: [''],
      image: [null] // Inicialize o FormControl para imagem
    });
  }
  

 // Método para lidar com a seleção de arquivo de imagem
 onFileSelected(event: any): void {
  const file: File = event.target.files[0];
  this.selectedImage = file;
  this.formCard.patchValue({
    image: file
  });
}
  carregarQuadros(): void {
    if (this.userId) {
      this.quadroService.getUserBoards(this.userId).subscribe((quadros: Quadro[]) => {
        console.log('Quadros obtidos:', quadros);
        this.quadros = quadros;
      }, error => {
        console.error('Erro ao carregar os quadros:', error);
      });
    } else {
      console.error('ID do usuário não especificado.');
    }
  }

  carregarUsuarios(): void {
    this.userService.getUsers().subscribe((usuarios: User[]) => {
      console.log('Usuários recuperados:', usuarios);
      this.usuarios = usuarios;
    }, error => {
      console.error('Erro ao carregar os usuários:', error);
    });
  }
  async onSubmit(): Promise<void> {
    if (this.formCard.invalid) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
  
    if (!this.selectedQuadroId) {
      alert('Selecione um quadro antes de criar o card.');
      return;
    }
  
    const userDataString = localStorage.getItem('user');
    if (!userDataString) {
      console.error('Dados do usuário não encontrados no armazenamento local.');
      return;
    }
  
    const userData = JSON.parse(userDataString);
    const userId = userData.uid;
    if (!userId) {
      console.error('ID do usuário não especificado.');
      return;
    }
  
    const quadroId = this.selectedQuadroId;
  
    // Obtenha a data selecionada do formulário
    const dueDate = this.formCard.value.dueDate ? new Date(this.formCard.value.dueDate) : null;
    const data: Data = {
      day: '',
      month: '',
      year: '',
      isPlaceholder: true,
    };
  
    // Crie um objeto cardData com os valores do formulário e a data selecionada
    const cardData = {
      ...this.formCard.value,
      dueDate: dueDate ? {
        day: dueDate.getDate(),
        month: dueDate.getMonth() + 1, // Mês é baseado em zero, então adicione 1
        year: dueDate.getFullYear()
      } : null,
      comments: [''], // Array vazio de comentários com um espaço reservado
    };
  
  
    const commentContent = this.formCard.value.comments || 'Novo comentário';
  
    const comment: Comment = {
      id: '',
      author: this.user?.nome || '',
      content: commentContent,
      timestamp: new Date().toISOString(),
      isPlaceholder: true,
    };
  
    console.log('Data selecionada do formulário:', this.formCard.value.dueDate);
    console.log('Data selecionada antes de chamar createCard:', cardData.dueDate);
    console.log('Conteúdo do objeto cardData antes de chamar createCard:', cardData); // Novo log adicionado
  
    try {
      await this.cardService.createCard(userId, quadroId, cardData, comment);
  
      console.log('Cartão criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar o card:', error);
      return;
    }
  }
  
  
  onSelectQuadro(event: MatSelectChange): void {
    this.selectedQuadroId = event.value;
    console.log('ID do quadro selecionado:', this.selectedQuadroId);

    if (this.selectedQuadroId !== null) {
      this.quadroId = this.selectedQuadroId; // Atribua o ID do quadro selecionado a quadroId
      this.selectedQuadro = this.quadros.find(quadro => quadro.quadroId === this.selectedQuadroId) || null;
    }
  }



  onSelectUser(event: MatSelectChange): void {
    const selectedUser = event.value as User;
    console.log('Usuário selecionado:', selectedUser);

    if (selectedUser) {
      this.user = selectedUser;
    } else {
      this.user = null;
    }
  }

  editarCard(card: Card, userId: string | null, quadroId: string | null): void {
    if (!userId) {
      console.error('ID do usuário não especificado.');
      return;
    }

    if (!quadroId) {
      console.error('ID do quadro não especificado.');
      return;
    }

    const cardId = card.id;

    if (!cardId) {
      console.error('ID do card inválido:', cardId);
      return;
    }

    const stringCardId = String(cardId);
    const estado = card.estado || ''; // Defina um valor padrão caso estado seja undefined
    this.cardService.updateCard(userId, quadroId, stringCardId, estado).then(() => {
      alert('Card atualizado com sucesso!');
    }).catch(error => {
      console.error('Erro ao editar o card:', error);
    });
  }

  carregarDetalhesQuadro(quadroId: string): void {
    this.quadroService.getQuadro(quadroId).subscribe((quadro: Quadro | undefined) => {
      if (quadro) {
        this.quadroDetalhes = quadro;
      } else {
        console.error('O quadro não foi encontrado.');
      }
    }, error => {
      console.error('Erro ao carregar os detalhes do quadro:', error);
    });
  }

}
