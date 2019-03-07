import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'
import { TiendaBixproService } from '../providers/tienda-bixpro.service'
import { MatStepper } from '@angular/material/stepper';


@Component({
  selector: 'app-crear-tienda',
  templateUrl: './crear-tienda.component.html',
  styleUrls: ['./crear-tienda.component.scss']
})
export class CrearTiendaComponent implements OnInit {
  formProspecto: FormGroup;
  secondFormGroup: FormGroup;
  formConfigTienda: FormGroup;
  stateFlag = true;
  hideText = false;
  enviar = false;
  plantilla: any;
  idUsuario : any;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('url') url: ElementRef;

  constructor(private _formBuilder: FormBuilder,
    private TiendaBixproService: TiendaBixproService) {

  }


  /* VALIDATION*/

  ngOnInit() {
    this.formProspecto = this._formBuilder.group({
      correo: ['', Validators.compose([Validators.required, Validators.email])],
      telefono: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+')])],
      diaInscripcion: [new Date()],
      estado: ['Iniciando']
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ''
    });
    this.initFormConfigTienda('', '', '','');
  }

  initFormConfigTienda(nombre, descripcion, sector,url) {
    this.formConfigTienda = this._formBuilder.group({
      nombre: [nombre, Validators.compose([Validators.required, Validators.maxLength(25), Validators.minLength(4)])],
      descripcion: [descripcion, Validators.compose([Validators.required, Validators.maxLength(255)])],
      url : [url,Validators.compose([Validators.required,Validators.maxLength(25), Validators.minLength(4)])],
      color : [''],
      sector: [sector],
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

      case "pattern":
        return "Algún caracter es invalido";

      case "minlength":
        return "La longitud minima de caracteres es de: " + errors.minlength["requiredLength"];

      case "maxlength":
        return "La longitud maxima de caracteres es de: " + errors.maxlength["requiredLength"];

    }
  }

  // Enviar prospecto;
  sendProspecto() {
    if (this.formProspecto.invalid) {
     this.informarUsuario("Ops... ¡Algo esta mal!", "Faltan campos por llenar y/o estan invalidos", 'error');
     return;
   }

    this.TiendaBixproService.sendPetition(this.formProspecto.value, 'prospectosBixpro').subscribe((response: any) => {
     Swal.close();
     console.log(response);
     this.informarUsuario(response.title, response.message, response.type);
     switch (response.code) {
       case -1:
         console.log("Error -1");
         console.log("No avanza");
         break;
       case 0:
         console.log("Error 0");
         this.idUsuario = response.id;
         switch(response.estado){
           case "Iniciando":
           this.actionStepper("2pasos");
           break;
           case "Finalizado":
           console.log("para finalizado");
           break;
         }
         break;
       case 1:
         this.idUsuario = response.id;
         this.actionStepper("2pasos");
         break;
     }
   })
  }

  informarUsuario(title, html, type) {
    Swal.fire({
      title: title,
      type: type,
      animation: false,
      customClass: 'animated lightSpeedIn alert-onboarding',
      html: html,
    })
  }

  actionStepper(accion: string, index?: number) {
    switch (accion) {
      case "atras": this.stepper.previous(); break;
      case "adelante": this.stepper.next(); break;
      case "index": this.stepper.selectedIndex = index; break;
      case "reset": this.stepper.reset(); break;
      case "2pasos":
        this.stepper.next();
        this.stepper.next();
        this.stateFlag = !this.stateFlag;
        this.enviar = false;
        this.hideText = true;
        break;
    }
  }

  setUrl(escribe,value?){
    
    if(!escribe && !this["reemplazar"]){
      this.formConfigTienda.controls.url.setValue(this.clearSpaces(this.formConfigTienda.value.nombre));
    }
    if(escribe){
      this["reemplazar"] = true;
      this.formConfigTienda.controls.url.setValue(this.clearSpaces(value));
    }
    this.url.nativeElement.value = this.formConfigTienda.value.url;
  }

  clearSpaces(value){
    return value.replace(/ /g,'').toLowerCase();
  }

  // Configuracion de tienda

  goToShop() {
    this.enviar = true;
    if (!this.plantilla) {
      this.informarUsuario("¿No te falta algo?", "Escoge el sector al que pertenece tu tienda", "warning");
      return;
    }
    
    if (this.plantilla == "T3") {
      this.formConfigTienda.controls["sector"].setValidators([Validators.compose([Validators.required])]);
      this.formConfigTienda.controls["sector"].updateValueAndValidity();
    }else{
      this.formConfigTienda.controls["sector"].clearValidators();
      this.formConfigTienda.controls["sector"].updateValueAndValidity();
    }

    if (this.formConfigTienda.invalid) {
      this.informarUsuario("¿No te falta algo?", "Revisa muy bien los campos antes de enviar la solicitud.", "warning");
      return;
    }

    let configuracion = this.formConfigTienda.value;
    configuracion.plantilla = this.plantilla;
    if (configuracion.plantilla != "T3") {
      delete configuracion.sector;
    }

    let swalWithBootstrapButtons = Swal.mixin({
      confirmButtonClass: 'btn btn-secundario text-white',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
    })

    swalWithBootstrapButtons.fire({
      title: `¿Es lo que quieres?`,
      animation: false,
      type: 'question',
      showCloseButton: true,
      html: `<div class="row">
      <div class="col-12">
        <strong>¡Estas a un paso! pero necesitamos que estes seguro de tu configuración, por eso te la mostramos a continuación:</strong>
      </div>
      <div class="col-12 mt-17">
        <div class="card">
          <div class="card-header">
            www.${configuracion.url}.bixpro.co
          </div>
          <div class="card-body">
            <h5 class="card-title">Tu descripción es:</h5>
            <p class="card-text">${configuracion.descripcion}</p>
          </div>
        </div>
      </div>
    </div>`,
      customClass: 'animated zoomInDown',
      showCancelButton: true,
      confirmButtonText: '¡Es lo que quiero!',
      cancelButtonText: 'Deseo Revisar',
    }).then((result) => {
      if (result.value) {
        this.sendPeticionTienda(configuracion);
      }
    })
  }

  sendPeticionTienda(confTienda){
    this.TiendaBixproService.sendPetition(confTienda, 'crearTienda').subscribe((response: any) => {
      Swal.close();
      this.informarUsuario(response.title, response.message, response.type);
      switch (response.code) {
        case -1:
          console.log("Error -1");
          console.log("No avanza");
          break;
        case 0:
          console.log("Error 0");
          
          break;
        case 1:
          this.actionStepper("2pasos");
          break;
      }
    })
  }

}
