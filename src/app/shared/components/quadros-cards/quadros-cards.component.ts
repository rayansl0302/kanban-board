import { Component, Input, OnInit } from '@angular/core';
import { Quadro } from '../../model/card/quadro/quadro.module';
import { QuadroService } from '../../services/quadro-service/quadro-service.service';
import { Card } from '../../model/card/card/card.module';
import { CardService } from '../../services/card-service/card-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user-service/user.service';

@Component({
  selector: 'app-quadros-cards',
  templateUrl: './quadros-cards.component.html',
  styleUrls: ['./quadros-cards.component.scss']
})
export class QuadrosCardsComponent implements OnInit {
  @Input() quadroDetalhes: Quadro | null = null;
  @Input() quadros: Quadro[] = [];

  
  selectedQuadroId: number | null = null; // Alterado para string para corresponder ao tipo do ID do quadro
  selectedQuadro: Quadro | null = null;
  formCard!: FormGroup;

  novoTitulo: string = '';
  novaDescricao: string = '';
  novoComentario: string = '';
  usuarioSelecionado: string | null = null; // Alterado para string para corresponder ao tipo do ID do usuário
  selectedLabels: string[] = ['Urgente','Normal','Sem Prazo ( A definir)'];
  usuarios: any[] = [];

  constructor(
    private quadroService: QuadroService,
    private userService: UserService,
    private cardService: CardService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.carregarQuadros();
    this.createForm();
    this.carregarUsuarios();
  }
  createForm(){
    this.formCard = this.formBuilder.group({
      id:[null],
      titulo:[null],
      descricao: [null],
      atribuido: [null],
      urgencia: [null],
      comentario: [null],
    })
  }
  onSubmit() {
    this.quadroService.adicionarCardAoQuadro(this.formCard.value).subscribe(e=>{
      alert("Cartão criado!");
      location.reload();
    });
  }

  carregarUsuarios(){
    this.userService.getUsers().subscribe(u => {
      this.usuarios = u;
    });
  }
  
  carregarQuadros() {
    this.quadroService.getQuadros().subscribe(quadros => {
      this.quadros = quadros;
    });
  }

  onSelectQuadro(): void {
    if (this.selectedQuadroId) { // Verifica se o ID do quadro foi selecionado
      this.selectedQuadro = this.quadros.find(quadro => quadro.id === this.selectedQuadroId) || null;
    } else {
      this.selectedQuadro = null;
    }
  }

  editarCard(card: Card) {
  }

  removerCard(cardId: string) {
  }
}
