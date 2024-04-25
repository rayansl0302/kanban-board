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
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
//consultas

import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from "../enviroments/environment"
import { RouterModule } from '@angular/router';
import { CriarQuadroDialogComponent } from './shared/components/criar-quadro-dialog/criar-quadro-dialog.component';
import { UserListComponent } from './shared/components/user-list/user-list.component';
import { EditCardModalComponent } from './shared/components/edit-card/edit-card-modal.component';
import { CriarComentarioComponent } from './shared/components/criar-comentario/criar-comentario.component';
import { CardDetailsComponent } from './shared/components/card-details/card-details.component';


@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    QuadrosCardsComponent,
    HomeComponent,
    LoginComponent,
    QuadroDetalhesComponent,
    NavbarComponent,
    CriarQuadroDialogComponent,
    UserListComponent,
    EditCardModalComponent,
    CriarComentarioComponent,
    CardDetailsComponent,
  ],
  exports: [
    QuadroDetalhesComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
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
    MatCheckboxModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    NgxMatFileInputModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    AuthGuard,
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
