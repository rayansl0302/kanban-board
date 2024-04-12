import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Quadro } from '../../model/card/quadro/quadro.module';
import { QuadroService } from '../../services/quadro-service/quadro-service.service';
import { AuthService } from '../../services/auth-service/auth-service.service';
import { QuadroDetalhesComponent } from '../quadro-detalhes/quadro-detalhes.component';
import { CardService } from '../../services/card-service/card-service.service';
import {  MatDialog } from '@angular/material/dialog';
import { QuadrosCardsComponent } from '../quadros-cards/quadros-cards.component';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @Output() quadroSelecionado = new EventEmitter<Quadro>();
  quadros: Quadro[] = [];
  
  selectedQuadroId: number | null = null;

  @ViewChild(QuadroDetalhesComponent) quadroDetalhesComponent!: QuadroDetalhesComponent;

  constructor(
    private router: Router,
    private quadroService: QuadroService,
    private cardService: CardService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
    this.carregarQuadros();
  }

  ngOnInit(): void {
    this.verificarAutenticacao();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  openDialog(){
    this.dialog.open(QuadrosCardsComponent)
  }
  verificarAutenticacao(): void {
    console.log('NavbarComponent: Verificando autenticação...');
    if (!this.authService.isUsuarioAutenticado()) {
      console.log('NavbarComponent: Usuário não autenticado, redirecionando para a página de login');
      this.router.navigateByUrl('/login');
    } else {
      console.log('NavbarComponent: Usuário autenticado');
    }
  }

  criarQuadro(): void {
    const nomeQuadro = prompt('Digite o nome do quadro:');

    if (nomeQuadro) {
      const novoQuadro: Quadro = { nome: nomeQuadro, cards: [] };
      this.quadroService.criarQuadro(novoQuadro).subscribe(() => {
        this.carregarQuadros();
      });
    }
  }

  fazerLogout(): void {
    this.authService.fazerLogout();
    this.router.navigateByUrl('/login');
  }

  isUsuarioAutenticado(): boolean {
    return this.authService.isUsuarioAutenticado();
  }

  carregarQuadros(): void {
    this.quadroService.getQuadros().subscribe(quadros => {
      this.quadros = quadros;
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
