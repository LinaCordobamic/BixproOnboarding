import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CrearTiendaComponent } from './crear-tienda/crear-tienda.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HttpClientModule } from '@angular/common/http';
import { ColorPickerModule } from 'ngx-color-picker'; 
@NgModule({
  declarations: [
    AppComponent,
    CrearTiendaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CarouselModule,
    HttpClientModule,
    ColorPickerModule


  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [CarouselModule]
})
export class AppModule { }
