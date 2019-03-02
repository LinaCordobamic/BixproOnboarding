import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    NgbModule,
  
  ],
  declarations: [],
  exports : [MaterialModule,NgbModule],
})
export class SharedModule { }
