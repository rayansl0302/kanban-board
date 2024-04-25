import { QuadroService } from '../../services/quadros-service/quadro.service';
import { Component, Input, OnInit } from '@angular/core';
import { QuadroDetalhes } from '../../model/quadro-detalhes/quadro-detalhes.model';
import { Quadro } from '../../model/card/quadro/quadro.module';

@Component({
  selector: 'app-quadro-detalhes',
  templateUrl: './quadro-detalhes.component.html',
  styleUrls: ['./quadro-detalhes.component.scss']
})
export class QuadroDetalhesComponent implements OnInit {
  @Input() quadroDetalhes: QuadroDetalhes | null = null;
  @Input() id!: string;
  quadros: Quadro[] = [];

  constructor(
    private quadroService: QuadroService
  ) {}

  ngOnInit(): void {
    this.carregarQuadros();
  }

  carregarQuadros(): void {
    
    // Se quadroDetalhes já estiver definido, não precisamos buscar novamente
    if (this.quadroDetalhes) {
      return;
    }
  
    // Se o ID não estiver definido, não podemos buscar os detalhes do quadro
    if (!this.id) {
      console.error('ID do quadro não fornecido.');
      return;
    }
  
    // Busca os detalhes do quadro com base no ID fornecido
    this.quadroService.getQuadro(this.id).subscribe(
      (quadroDetalhes: any) => {
        // Verifica se quadroDetalhes foi encontrado
        if (quadroDetalhes) {
          // Atribui os detalhes do quadro
          this.quadroDetalhes = {
            nome: quadroDetalhes.nome,
            id: parseInt(quadroDetalhes.id || ''), // Converte o ID para número, se necessário
            cards: Object.values(quadroDetalhes.cards) // Converte o objeto de cards em um array
          };
          console.log('Quadro detalhes:', this.quadroDetalhes);
        } else {
          console.error('Quadro detalhes não encontrado com o ID:', this.id);
        }
      },
      (error) => {
        console.error('Erro ao carregar os detalhes do quadro:', error);
      }
    );
  }
  
}
