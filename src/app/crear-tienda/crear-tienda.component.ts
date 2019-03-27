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
  idUsuario: any;
  nuevo: boolean;
  datosEnviados: any;
  colorP = "#ff7653";
  colorS = "#16a085";
  preset = "Colores Recomendados"
  configurando = false;
  finalizado = true;
  estado = "";
  estadoNumero = 1;
  responde = false;
  urlPagina : any;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('url') url: ElementRef;

  constructor(private _formBuilder: FormBuilder,
    private TiendaBixproService: TiendaBixproService) {

  }


  /* PRECIOS PLANES */
  planemprende = [
    {id:'Trimestral', precio:'$165.000 COP'},
    {id:'Semestral -5%', precio:'$313.500 COP <br><span><strike>Sin descuento $330.000 COP</strike></span>'},
    {id:'Anual -10%', precio:'$594.000 COP <br><span><strike>Sin descuento $660.000 COP</strike></span>'},
];
tiempoSeleccionadoemprende = '$165.000 COP';


planavanza = [
  {id:'Trimestral', precio:'$240.000 COP'},
  {id:'Semestral -5%', precio:'$456.000 COP <br><span><strike>Sin descuento $480.000 COP</strike></span>'},
  {id:'Anual -10%', precio:'$864.000 COP <br><span><strike>Sin descuento $960.000 COP</strike></span>'},
];
tiempoSeleccionadoavanza = '$240.000 COP';


planpremium = [
  {id:'Trimestral', precio:'$360.000 COP'},
  {id:'Semestral -5%', precio:'$684.000 COP <br><span><strike>Sin descuento $720.000 COP</strike></span>'},
  {id:'Anual -10%', precio:'$1.296.000 COP <br><span><strike>Sin descuento $1440.000 COP</strike></span>'},
];
tiempoSeleccionadopremium = '$360.000 COP';
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
    this.initFormConfigTienda('', '', '', '');
    this.estado = "Estamos preparando tu tienda " + this.formConfigTienda.value.nombre;
  }

  initFormConfigTienda(nombre, descripcion, sector, url) {
    this.formConfigTienda = this._formBuilder.group({
      nombre: [nombre, Validators.compose([Validators.required, Validators.maxLength(25), Validators.minLength(4)])],
      descripcion: [descripcion, Validators.compose([Validators.required, Validators.maxLength(255)])],
      url: [url, Validators.compose([Validators.required, Validators.maxLength(25), Validators.minLength(4)])],
      colorP: [this.colorP],
      colorS: [this.colorS],
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
    autoplay: false,
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
      this.informarUsuario("Ops... ¡Algo esta mal!", "Faltan campos por llenar y/o están inválidos", 'error');
      return;
    }


    this.datosEnviados = this.formProspecto.value;
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
          //localStorage.setItem("nuevo","1");
          this.nuevo = false;
          this.idUsuario = response.id;
          switch (response.estado) {
            case "Iniciando":
              this.actionStepper("2pasos");
              break;
            case "Finalizado":
              console.log("para finalizado");

              this.finalizado = true;
              this.urlPagina = response.url;
              break;
          }
          break;
        case 1:
          //localStorage.setItem("nuevo","0");
          this.nuevo = true;
          this.idUsuario = response.id;
          this.actionStepper("2pasos");
          break;
      }
    });
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

  setUrl(escribe, value?) {
    if (!escribe && !this["reemplazar"]) {
      this.formConfigTienda.controls.url.setValue(this.clearSpaces(this.formConfigTienda.value.nombre));
    }
    if (escribe) {
      this["reemplazar"] = true;
      this.formConfigTienda.controls.url.setValue(this.clearSpaces(value));
    }
    this.url.nativeElement.value = this.formConfigTienda.value.url;
  }

  clearSpaces(value) {
    return value.replace(/ /g, '').toLowerCase();
  }

  // Configuracion de tienda

  goToShop() {
    this.configurando = false;
    this.enviar = true;
    if (!this.plantilla) {
      this.informarUsuario("¿No te falta algo?", "Escoge el sector al que pertenece tu tienda", "warning");
      return;
    }

    if (this.plantilla == "T3") {
      this.formConfigTienda.controls["sector"].setValidators([Validators.compose([Validators.required])]);
      this.formConfigTienda.controls["sector"].updateValueAndValidity();
    } else {
      this.formConfigTienda.controls["sector"].clearValidators();
      this.formConfigTienda.controls["sector"].updateValueAndValidity();
    }

    if (this.formConfigTienda.invalid) {
      this.informarUsuario("¿No te falta algo?", "Revisa muy bien los campos Sin descuento de enviar la solicitud.", "warning");
      return;
    }

    let configuracion = this.formConfigTienda.value;
    configuracion.colorP = this.colorP;
    configuracion.colorS = this.colorS;
    configuracion.plantilla = this.plantilla;

    if (configuracion.plantilla != "T3") {
      delete configuracion.sector;
    }

    let swalWithBootstrapButtons = Swal.mixin({
      confirmButtonClass: 'btn btn-secundario text-white',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
    })

    console.log(configuracion);
    
    let request = new XMLHttpRequest();
   request.open('GET', "www."+configuracion.url+".bixpro.co", true);
    request.send();
    let cont = 0;
    request.onreadystatechange = ()=>{
      cont ++;
      if(request.status === 404){
        if(cont == 1){
          swalWithBootstrapButtons.fire({
            title: `Confirmar datos`,
            animation: false,
            type: 'question',
            showCloseButton: true,
            html: `<div class="row">
            <div class="col-12">
              <p>¡Estas a un paso! pero necesitamos que estes seguro de tu configuración, por eso te la mostramos a continuación:</p>
            </div>
            <div class="col-12 mt-17">             
            <h4>Url de la tienda</h4>                 
            <div class="field-info">
                <p class="card-text">www.${configuracion.url}.bixpro.co</p>
            </div>
          <h4>Descripción de la tienda</h4>
          <div class="field-info">
              <p class="card-text">${configuracion.descripcion}</p>
            </div>
            </div>
            
          </div>`,
            customClass: 'animated zoomInDown sweet-confirmacion',
            showCancelButton: true,
            confirmButtonText: '¡Es lo que quiero!',
            cancelButtonText: 'Deseo Revisar',
          }).then((result) => {
            if (result.value) {
              console.log("acepto");
              this.sendPeticionTienda(configuracion);
              this.configurando = true;
              let interval = setInterval(() => {
                this.updateEstado(this.estadoNumero);
                if(this.estadoNumero > 6 && this.responde)  clearInterval(interval);
              }, 3000);
            }
          })
        }
      }else{
        if(cont === 1) this.informarUsuario('¡Hey!',"Encontramos que ya existe una url www."+configuracion.url+".bixpro.co, intenta con otra url por favor","info");
      }
    }
  }

  sendPeticionTienda(confTienda) {
    this.responde = false;
    confTienda.id = this.idUsuario;
    confTienda.correo = this.formProspecto.value.correo;
    confTienda.telefono = this.formProspecto.value.telefono.toString();
    if(!confTienda.id){
      this.informarUsuario('¡Hey!',"Encontramos un error con respecto a tu registro , recarga la pagina e intenta nuevamente","error");
      return;
    };
      this.TiendaBixproService.sendPetition(confTienda, 'crearTienda').subscribe((response: any) => {
      this.responde = true;
      switch(response.code){
        case 0 :
         
        break;
        case 1: 
        this.finalizado = true;
        this.urlPagina = response.url;
        break;
      }
    });  
  }

  updateEstado(estado){
    this.estadoNumero++;
    switch (estado){
      case 1:
      this.estado = "Estamos creando tu tienda";
      break;
      case 2:
      this.estado = "Aplicando la configuracion a tu tienda";
      break;
      case 3:
      this.estado = "Creando el dominio www."+this.formConfigTienda.value.url+".bixpro.co";
      break;
      case 4:
      this.estado = "Actualizando el contenido de tu tienda";
      break;
      case 5:
      this.estado = "Creando tus credenciales";
      break;
      case 6:
      this.estado = "Ya casi esta todo listo";
      break;
      default :
      this.estado = "Ya casi esta todo listo";
      break;
    }
    if(this.estadoNumero > 6 && this.responde){
      this.configurando = false;
    }
  }

  actionFinalizado(url){
    window.open(url);
  }
}
