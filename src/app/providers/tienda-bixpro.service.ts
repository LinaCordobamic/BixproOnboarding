import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class TiendaBixproService {
  private urlHTTP = "https://us-central1-cms-mic.cloudfunctions.net";
  
  constructor(private httpClient: HttpClient) { }


  sendPetition(data, url){
    this.esperaUsuario();
    return this.httpClient.post(this.urlHTTP + '/' + url, {
      body: data,
    })
  }
  
  esperaUsuario() {
    Swal.fire({
        title: 'Estamos procesando su petición',
        customClass: 'sweet-cms',
        html: 'Esta ventana se cerrara automaticamente, Espere por favor ...',
        onBeforeOpen: () => {
          Swal.showLoading()
        },
      })
    }

}

