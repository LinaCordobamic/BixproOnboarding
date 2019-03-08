const functions = require('firebase-functions');
const express = require("express")
const cors = require("cors")

import * as bodyParser from "body-parser";
import * as admin from 'firebase-admin';


const auth = express();
auth.use(cors({ origin: true }));
auth.use(bodyParser.json());
auth.use(bodyParser.urlencoded({ extended: true }));


auth.post("/", (request: any, response: any) => {
    const data = request.body.body;
    console.log(data);
    response.header('Content-Type', 'application/json');
    response.header('Access-Control-Allow-Origin', '*');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    admin.firestore()
        .collection("prospectos")
        .doc(data.id)
        .update({
            estado: "Finalizado",
            fechaFinalizado : new Date()
        }).catch(err => {
            console.log("error prospectos: " + err);
        });

    admin.auth().createUser({
        uid: data.id,
        email: data.correo,
        password: data.telefono
    }).catch(err=>{
        console.log("error creando usuario: " + err);
    });


    

    admin.firestore()
         .collection("usuarios")
         .doc(data.id)
         .set({
             activo : true,
             id: data.id,
             uid : data.id,
             datos : {
                 correo : data.correo,
                 telefono : data.telefono,
                 nombres : '',
                 apellidos : ''
             },
             bixpro : true,
             idBixpro : '',
         })

    
    admin.firestore()
         .collection("proyectos")
         .add({
           activo : true,
           bixpro : true,
           confTienda : {
             date_start : new Date().toLocaleDateString().replace(/ /g,"")
           },  
         })

    return;


});


export const crearTienda = functions.https.onRequest((request: any, response: any) => {
    if (!request.path) {
        request.url = `/${request.url}`;
    }
    return auth(request, response);
});