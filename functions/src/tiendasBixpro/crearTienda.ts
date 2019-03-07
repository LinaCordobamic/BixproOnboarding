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
    const data = request.body.body;
    console.log(data);
    response.header('Content-Type', 'application/json');
    response.header('Access-Control-Allow-Origin', '*');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    let correo = data.correo;
    delete data.correo;

    admin.firestore()
         .collection("prospectos")
         
    return;


});


export const crearTienda = functions.https.onRequest((request : any, response : any) => {
    if (!request.path) {
        request.url = `/${request.url}`;
    }
    return auth(request, response);
});