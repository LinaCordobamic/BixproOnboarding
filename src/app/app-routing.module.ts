import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearTiendaComponent } from './crear-tienda/crear-tienda.component';


const routes: Routes = [

  {
    path: '',
    component:CrearTiendaComponent,
  },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
