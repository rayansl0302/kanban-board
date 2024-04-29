import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Card } from '../../model/card/card/card.module';
import { CardService } from '../../services/card-service/card.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../services/auth-service/auth-service.service';

@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.scss']
})
export class UploadImagesComponent {
  formCard!: FormGroup; // Definindo formCard como um FormGroup
  showImageUpload: boolean = false;
  selectedImages: File[] = []; // Array para armazenar as imagens selecionadas
  imageURLs: string[] = []; // Array para armazenar os links das imagens
  userId: string | undefined;
  @Input() quadroId: string | undefined;
  card!: Card;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private cardService: CardService,
    private formBuilder: FormBuilder
  ) {
    // Inicialize o formCard aqui
    this.formCard = this.formBuilder.group({
      imageURLs: [[]] // Inicializando o campo de imageURLs como um array vazio
    });

    // Atribua os dados recebidos aos membros correspondentes do componente
    this.userId = data.userId;
    this.quadroId = data.quadroId;
    this.card = data.card;
  }

  async enviarImagens(): Promise<void> {
    try {
      console.log('this.userId:', this.userId);
      console.log('this.quadroId:', this.quadroId);
      console.log('this.card.id:', this.card.id);
      console.log('this.selectedImages:', this.selectedImages);
      
      if (this.userId && this.quadroId && typeof this.card.id === 'string' && this.selectedImages.length > 0) {
        const cardId = this.card.id as string; // Convertendo this.card.id para string
        // Enviar todas as imagens selecionadas
        await this.cardService.enviarImagens(this.userId, this.quadroId, cardId, this.selectedImages);
        
        // Adicionar os links das imagens ao array de imageURLs
        for (const image of this.selectedImages) {
          const imageURL = await this.cardService.getImageURL(this.userId, this.quadroId, cardId, image.name);
          this.imageURLs.push(imageURL);
          // Atualize o card com o URL da imagem
          await this.cardService.updateCardImageURL(this.userId, this.quadroId, cardId, imageURL);
        }
        
        console.log('Todas as imagens foram enviadas com sucesso.');
        // Faça qualquer ação necessária após o envio das imagens, como atualizar a interface, etc.
      } else {
        console.error('Informações incompletas para enviar imagens.');
        // Lide com o caso em que as informações necessárias não estão disponíveis
      }
    } catch (error) {
      console.error('Erro ao enviar imagens:', error);
      // Lide com o erro adequadamente, exiba uma mensagem para o usuário, etc.
    }
  }
  
  onFilesSelected(event: any): void {
    const files: FileList = event.target.files; // Obtendo a lista de arquivos selecionados
    if (files && files.length > 0) {
      // Adicionar todas as imagens selecionadas ao array selectedImages
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
          this.selectedImages.push(file);
        }
      }
      
      console.log('Imagens selecionadas:', this.selectedImages);
    }
  }
}
