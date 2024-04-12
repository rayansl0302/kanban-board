import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuadroService } from '../../services/quadro-service/quadro-service.service';
import { QuadroDetalhes } from '../../model/quadro-detalhes/quadro-detalhes.model';
import { Quadro } from '../../model/card/quadro/quadro.module';
@Component({
  selector: 'app-quadro-detalhes',
  templateUrl: './quadro-detalhes.component.html',
  styleUrls: ['./quadro-detalhes.component.scss']
})
export class QuadroDetalhesComponent implements OnInit {
  @Input() quadroDetalhes: QuadroDetalhes | null = null;
  @Input() id!: number; // Recebe o id como input
  quadros: Quadro[] = [];

  constructor(private quadroService: QuadroService) {

    this.quadroService.id$.subscribe(v => {
      console.log(v)
    })
  }

  ngOnInit(): void {
    this.quadroService.quadroSelecionado$.subscribe(quadro => {
      if (quadro !== null && quadro !== undefined) {
        this.carregarDetalhes(quadro); // Carrega os detalhes do quadro selecionado
      }
    });
  }


  carregarDetalhes(quadro: Quadro): void {
    if (quadro.id !== null && quadro.id !== undefined) {
      const quadroDetalhes: QuadroDetalhes = {
        id: quadro.id,
        nome: quadro.nome,
        cards: quadro.cards
      };
      this.quadroDetalhes = quadroDetalhes;
    }
  }
}
