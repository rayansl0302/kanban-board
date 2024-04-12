import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Quadro } from '../../model/card/quadro/quadro.module';
import { AuthService } from '../../services/auth-service/auth-service.service';
import { FirestoreService } from '../../services/firestore-service/firestore.service';
import { QuadrosCardsComponent } from '../quadros-cards/quadros-cards.component';
import { Observable } from 'rxjs'; // Importar Observable do pacote rxjs
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @Output() quadroSelecionado = new EventEmitter<Quadro>();
  quadros: Quadro[] = [];
  selectedQuadroId: number | null = null;

  constructor(
    private router: Router,
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.verificarAutenticacao();
    this.carregarQuadros();
  }

  ngAfterViewInit(): void {
  }

  openDialog(): void {
    this.dialog.open(QuadrosCardsComponent, {
      width: '750px',
    });
  }

  verificarAutenticacao(): void {
    console.log('NavbarComponent: Verificando autenticação...');
    if (!this.authService.isUsuarioAutenticado()) {
      console.log('NavbarComponent: Usuário não autenticado, redirecionando para a página de login');
      this.router.navigateByUrl('/login'); // Redirecionar para a página de login
    } else {
      console.log('NavbarComponent: Usuário autenticado');
    }
  }
  criarQuadro(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const userId: number = Number(user.uid); // Convertendo o UID para número

        const nomeQuadro = prompt('Digite o nome do quadro:');

        if (nomeQuadro) {
          const novoQuadro: Quadro = { nome: nomeQuadro, cards: [] };
          this.firestoreService.createQuadro(userId, novoQuadro).then(() => {
            this.carregarQuadros();
          });
        }
      }
    });
  }



  fazerLogout(): void {
    this.authService.fazerLogout().subscribe(() => {
      this.router.navigateByUrl('/login'); // Redirecionar para a página de login após o logout
    });
  }

  isUsuarioAutenticado(): Observable<boolean> {
    return this.authService.isUsuarioAutenticado();
  }



  carregarQuadros(): void {
    // Obtenha o ID do usuário atualmente autenticado
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // Converte o ID do usuário para número, se necessário
        const userId = Number(user.uid);

        // Carregue os quadros do usuário utilizando o serviço Firestore
        this.firestoreService.getUserBoards(userId).subscribe(quadros => {
          this.quadros = quadros;
        }, error => {
          console.error('Erro ao carregar os quadros:', error);
        });
      }
    });
  }

  changeId(value: any): void {
    this.selectedQuadroId = value.value;
    if (this.selectedQuadroId) {
      const quadroSelecionado = this.quadros.find(quadro => quadro.id === this.selectedQuadroId);
      if (quadroSelecionado) {
        this.quadroSelecionado.emit(quadroSelecionado);
      }
    }
  }
}
