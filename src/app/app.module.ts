import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { QuadroDetalhesComponent } from './shared/components/quadro-detalhes/quadro-detalhes.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './shared/components/card/card.component';
import { QuadrosCardsComponent } from './shared/components/quadros-cards/quadros-cards.component';
import { HomeComponent } from './shared/pages/home/home.component';
import { LoginComponent } from './shared/pages/login/login.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './shared/services/auth-service/auth-guard';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
//angular material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    QuadrosCardsComponent,
    HomeComponent,
    LoginComponent,
    QuadroDetalhesComponent,
    NavbarComponent,
  ],
  exports: [
    QuadroDetalhesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    DragDropModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    NgbModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }