const functions = require('firebase-functions');
const express = require("express")
const cors = require("cors")

import * as bodyParser from "body-parser";
import * as admin from 'firebase-admin'; 


const auth = express();
auth.use(cors({ origin: true }));
auth.use(bodyParser.json());
auth.use(bodyParser.urlencoded({ extended: true }));


auth.post("/", (request : any, response : any) => {
    console.log(request.headers);
    const data = request.body.body;
    console.log(data);
    response.header('Content-Type', 'application/json');
    response.header('Access-Control-Allow-Origin', '*');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    data.latlong = request.headers['x-appengine-citylatlong'];
    data.city = request.headers['x-appengine-city'];
    data.ip = request.headers['x-appengine-user-ip'];
    data.ip_for = request.headers['x-forwarded-for'];
    
    admin.firestore()
         .collection("prospectos")
         .where("correo","==",data.correo).get()
         .then(e =>{
            if(e.empty){
                admin.firestore()
                     .collection("prospectos")
                     .add(data).then(ee=>{
                        console.log("Ingresando a bd: " + data.correo + " , " + data.telefono); 
                        response.json({code : 1 , title : "Exito", message: "Bienvenido a Bixpro, estas a unos cuantos pasos de crear tu propia tienda", type : "success" , id : ee.id});
                     }).catch(err=>{
                        console.log(err);
                        response.json({code: -1 , title : "Error", message: "Error en la peticion, por favor recargue la pagina e intentelo nuevamente, si el error persiste consulte a nuestros asesores gracias. codigo 1",type:"error"});
                     });     
            }else{
                
                const usuarios = e.docs.map(doc => {
                    let usuario = doc.data();
                    usuario.id = doc.id;
                    return usuario
                });
            
                console.log("Ya existe en base de datos: " + data.correo + " , " + data.telefono);
                switch(usuarios[0].estado){
                    case "Iniciando":
                    response.json({code : 0 , title : "Advertencia", message: "Hemos detectado que ya has iniciado tu proceso, asi que seras redirigido donde has quedado" , type : "warning" , id : usuarios[0].id , estado : usuarios[0].estado });    
                    break;
                    case "Finalizado":
                    response.json({code : 0 , title : "¡Hey!", message: "Según los datos de nuestro sistema ya tuviste un registro previo y finalizaste la etapa de construcción correctamente." , type : "error" , id : usuarios[0].id , estado : usuarios[0].estado });
                    break;
                    default:
                    response.json({code : 0 , title : "Advertencia", message: "Hemos detectado que ya has iniciado tu proceso, asi que seras redirigido donde has quedado" , type : "warning" , id : usuarios[0].id , estado : usuarios[0].estado });    
                    break;
                }
            }
         }).catch(err=>{
            console.log(err);
            response.json({code: -1 , title : "Error", message: "Error en la peticion, por favor recargue la pagina e intentelo nuevamente, si el error persiste consulte a nuestros asesores gracias. codigo 0",type:"error"});
         })
    return;
});


export const prospectosBixpro = functions.https.onRequest((request : any, response : any) => {
    if (!request.path) {
        request.url = `/${request.url}`;
    }
    return auth(request, response);
});