import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './shared/pages/home/home.component';
import { LoginComponent } from './shared/pages/login/login.component';
import { QuadrosCardsComponent } from './shared/components/quadros-cards/quadros-cards.component';
import { AuthGuard } from './shared/services/auth-service/auth-guard';
import { QuadroDetalhesComponent } from './shared/components/quadro-detalhes/quadro-detalhes.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent , canActivate: [AuthGuard] }, // Protegida pela guarda de rota
  { path: 'login', component: LoginComponent}, // Página de login não protegida
  { path: 'quadro-cards', component: QuadrosCardsComponent, canActivate: [AuthGuard]   }, // Protegida pela guarda de rota
  { path: 'quadro-detalhe/:id', component: QuadroDetalhesComponent, canActivate: [AuthGuard]   },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
