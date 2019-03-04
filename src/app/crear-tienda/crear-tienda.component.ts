import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormsModule} from '@angular/forms';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-crear-tienda',
  templateUrl: './crear-tienda.component.html',
  styleUrls: ['./crear-tienda.component.scss']
})
export class CrearTiendaComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  stateFlag = true;
  hideText = false;
  enviar= false;


  constructor(private _formBuilder: FormBuilder) {
  
  }

   /* VALIDATION*/
  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      correoCtrl: ['',Validators.compose([Validators.required,Validators.email])],
      celularCtrl: ['',Validators.compose([Validators.required])]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ''
    });
  }
/* owl carousel columna derecha*/
  title = 'angularowlslider';
  customOptions: any = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 5500,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }

/* owl carousel planes*/
  customdosOptions: any = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 4500,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }


 /* VALIDATION - mensajes de error*/

    getError(form: any, control) {
      let errors = form.controls[control].errors;
      if (!errors) return "";
      let keysErrors = Object.keys(errors);
      if (keysErrors.length == 0) return "";
      
      switch (keysErrors[0]) {
      case "required":
      return "Necesitamos este campo para que puedas crear tu tienda :)";
      
      case "email":
      return "Verifica que el formato de correo esté escrito correctamente";
  
      }
      }

      /*SWEEtALERT */

      showLoading() { 
        Swal.fire (
          {
            html: 'Enviando datos <strong></strong> ...',
            timer: 10000,
            customClass: 'alert-onboarding'
            
          }
        )
    
        Swal.showLoading()
      }
}
