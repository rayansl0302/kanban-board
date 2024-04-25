import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';

import { Quadro } from '../../model/card/quadro/quadro.module';
import { AuthService } from '../../services/auth-service/auth-service.service';
import { CriarQuadroDialogComponent } from '../criar-quadro-dialog/criar-quadro-dialog.component';
import { QuadrosCardsComponent } from '../quadros-cards/quadros-cards.component';
import { Card } from '../../model/card/card/card.module';
import { QuadroService } from '../../services/quadros-service/quadro.service';
import { CardService } from '../../services/card-service/card.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() quadroSelecionado = new EventEmitter<Quadro>();

  selectedBoardId: string | null = null;
  cards: Card[] = [];
  quadros: Quadro[] = [];
  selectedQuadroId: string | null = null;
  usuarioLogado: string | null = null;
  autenticado$!: Observable<boolean>;
  quadroId: string | null = null; // Declarando quadroId

  constructor(
    private quadroService: QuadroService,
    private authService: AuthService,
    private cardService: CardService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    // Inicializar autenticado$ como um observable
    this.autenticado$ = this.isUsuarioAutenticado();

    // Carregar os quadros ao inicializar o componente
    this.carregarQuadros();
    this.obterEmailUsuario();
    this.selectedBoardId = "board1"; // Exemplo: Supondo que o ID do quadro selecionado seja "board1"
  }

  openDialog(quadroId: string | null): void { // Adicione quadroId como parâmetro
    const dialogRef = this.dialog.open(QuadrosCardsComponent, {
      width: '650px',
      height: '440px',
      data: { quadroId } // Passe quadroId para a modal
    });
  }

  fazerLogout(): void {
    this.authService.logout().then(() => {
      // Redirecionar para a página de login após o logout
    }).catch(error => {
      console.error('Erro ao fazer logout:', error);
    });
  }

  criarQuadro(): void {
    const dialogRef = this.dialog.open(CriarQuadroDialogComponent, {
      width: '450px',
      height: '360px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { nome, visivelParaTodos } = result;

        this.authService.afAuth.currentUser.then(user => {
          console.log('Usuário atual:', user);
          if (user && user.uid) {
            console.log('UID do usuário:', user.uid);
            const userId = user.uid;
            const novoQuadro: Quadro = { nome, visivelParaTodos, cards: [] };
            this.quadroService.createQuadro(userId, novoQuadro).then(quadroId => { // Adicionar quadroId como parâmetro
              novoQuadro.quadroId = quadroId; // Atribuir o ID retornado ao novoQuadro
              this.carregarQuadros(); // Carregar quadros após a criação
            }).catch(error => {
              console.error('Erro ao criar o quadro:', error);
            });
          } else {
            console.error('Usuário não autenticado ou UID não definido.');
          }
        }).catch(error => {
          console.error('Erro ao obter o usuário atual:', error);
        });
      }
    });
  }

  carregarQuadros(): void {
    this.autenticado$.subscribe(autenticado => {
      if (autenticado) {
        this.authService.afAuth.authState.subscribe(user => {
          if (user !== null) {
            const userId = user.uid;
            this.quadroService.getUserBoards(userId).subscribe((quadros: Quadro[]) => {
              if (quadros && Array.isArray(quadros)) { // Verifica se quadros é um array
                this.quadros = quadros;
                console.log('Quadros carregados:', this.quadros);
              } else {
                console.error('Os quadros obtidos não são válidos:', quadros);
              }
            }, error => {
              console.error('Erro ao carregar os quadros:', error);
            });
          }
        });
      }
    });
  }

  onSelectBoard(boardId: string): void {
    this.selectedBoardId = boardId;
    if (boardId) {
      this.loadCards(boardId);
    } else {
      this.cards = [];
    }
  }

  loadCards(boardId: string): void {
    this.cardService.getBoardCards(boardId).subscribe(cards => {
      this.cards = cards;
    });
  }

  changeId(selectedQuadroId: string): void {
    this.selectedQuadroId = selectedQuadroId;
    if (selectedQuadroId) {
      const quadroSelecionado = this.quadros.find(quadro => quadro.quadroId === selectedQuadroId);
      if (quadroSelecionado) {
        // Emitir o quadro selecionado em vez do ID
        this.quadroSelecionado.emit(quadroSelecionado);
      } else {
        console.error('Quadro selecionado não encontrado na lista de quadros:', selectedQuadroId);
      }
    } else {
      console.error('ID do quadro não especificado.');
    }
  }

  obterEmailUsuario(): void {
    this.authService.afAuth.authState.subscribe(user => {
      if (user) {
        this.usuarioLogado = user.email;
      }
    }, error => {
      console.error('Erro ao obter o e-mail do usuário:', error);
    });
  }

  selecionarQuadro(quadro: Quadro): void {
    this.quadroSelecionado.emit(quadro);
    console.log('enviado quadro', quadro)
  }

  isUsuarioAutenticado(): Observable<boolean> {
    return of(this.authService.logado);
  }
}
