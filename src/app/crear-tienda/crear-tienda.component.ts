import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormsModule} from '@angular/forms';
@Component({
  selector: 'app-crear-tienda',
  templateUrl: './crear-tienda.component.html',
  styleUrls: ['./crear-tienda.component.scss']
})
export class CrearTiendaComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  stateFlag = true;
  enviar= false;


  constructor(private _formBuilder: FormBuilder) {
  
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      correoCtrl: ['',Validators.compose([Validators.required,Validators.email])],
      celularCtrl: ['',Validators.compose([Validators.required])]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ''
    });
  }

  title = 'angularowlslider';
  customOptions: any = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
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


  customdosOptions: any = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 8500,
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

}
