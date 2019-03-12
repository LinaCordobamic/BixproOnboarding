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
    let error = false;
    console.log(data);
    response.header('Content-Type', 'application/json');
    response.header('Access-Control-Allow-Origin', '*');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");



    let batch = admin.firestore().batch();

    console.log("Actualizando datos de prospecto");
    batch.update(admin.firestore()
        .collection('prospectos')
        .doc(data.id), {
            estado: "Finalizado",
            fechaFinalizado: new Date(),
            urlPagina : "www."+data.url+".bixpro.co"
        })

    let usuario = {
        activo: true,
        id: data.id,
        uid: data.id,
        datos: {
            correo: data.correo,
            telefono: data.telefono,
            nombres: '',
            apellidos: ''
        },
        bixpro: true,
        idBixpro: '',
        roles: {
            admin: true,
            editor: true,
            lector: true,
            pagos: true
        }
    }

    console.log("Creando Usuario en auth");
    
    let day = new Date();
    day.setDate(day.getDate() + 60);

    console.log("Creadno proyecto en proyectos");
    admin.firestore()
        .collection("proyectos")
        .add({
            activo: true,
            bixpro: true,
            confBixpro: {
                date_start: new Date().toLocaleDateString(),
                date_end: day,
                capacidadAlmacenamiento: -1,
                capacidadUsuarios: -1,
                pasarelaPagos: false,
                pedidos: 10,
                productos: 10,
                status: "gratuito",
                suscripcion: true,
                trial_days: 60,
                type: "creado",
                usuariosCMS: 1
            },
            dominio: {
                nombre: "www."+data.url+".bixpro.co" /// aqui url
            },
            idContacto: "P7snxEVTyc1gzvnkOtae",
            idPlantilla: data.plantilla, // aqui va la plantilla
            modulos: {
                contactos: true,
                formularios: {
                    activo: true,
                    PQR: { activo: false, label: "PQR" },
                    contactenos: { activo: true, label: "Contáctenos" },
                    trabajaConNosotros: { activo: true, label: "Trabaja con nosotros" }
                },
                publicaciones: false,
                sitios: false,
                sms: false,
                tienda: true
            },
            nombre: data.nombre, // nombre tienda
            plan: {
                gratuito: true,
                id: "descubre_mic",
                nombre: "Descubre"
            },
            recursosDatabase: 0,
            recursosStorage: 0,
            saldo: 0,
            tipo: "Tienda",
            usuarios: [usuario]
        }).then(e => {

            admin.auth().createUser({
                uid: data.id,
                email: data.correo,
                password: data.telefono
            }).then(() => {
                console.log("Usuario creado correctamente");
                
                console.log("Creando usuario en base de datos de usuario");
                usuario.idBixpro = e.id;
                batch.set( admin.firestore()
                .collection("usuarios")
                .doc(data.id),usuario);

                console.log("Actualizando usuario en proyecto");
                batch.update(admin.firestore()
                .collection("proyectos")
                .doc(e.id),{usuarios : [usuario]});

                console.log("Proyecto creado correctamente");

            console.log("Creando suscripción de proyecto");
            batch.set(admin.firestore()
            .collection("proyectos")
            .doc(e.id).collection("suscripcion")
            .doc(e.id),{
                type: "creado",
                    status: "gratuito",
                    plan: {
                        gratuito: true,
                        id: "descubre_mic",
                        nombre: "Descubre"
                    },
                    created: new Date().toLocaleDateString(),
                    period_start: new Date().toLocaleDateString(),
                    period_end: day.toLocaleDateString(),
                    id: e.id,
                    message: "Recien creado",
                    estado: "creado",
            });

            console.log("Creando Tienda en tiendas");

            batch.set(admin.firestore()
            .collection("tiendas")
            .doc(e.id),{
                activo:true,
                banners : [],
                descripcion : data.descripcion, // aqui va la descripción de la tienda
                informacionLegal : {},
                menuCategorias :{
                    estructura : []
                },
                nombre : data.nombre, // aqui va el nombre de la tienda
                valorMinimo : 0
            })

            console.log("Creando Plantilla en tiendas");

            batch.set(admin.firestore()
            .collection("tiendas")
            .doc(e.id).collection("infoPlantilla")
            .doc(data.plantilla),{ // aqui va la plantilla
                caracteristicasActivo : true,
                descripcion1 : "Tenemos los productos que se destacan su elaboración.",
                descripcion2 : "Entregas máximo 2 horas después de haber solicitado su pedido.",
                descripcion3 : "En esta descripción debes poner donde se encuentran ubicados",
                descripcionMarcas : "Las mejores y más play de todo el mercado.",
                descripcionPrincipal : "Mi tienda " + data.nombre,
                nombre : data.nombre, // aqui va el nombre de la tienda
                seccionMarcasActivo : true,
                slogan : "Aqui va tu slogan",
                titulo1 : "Calidad",
                titulo2 : "Envios",
                titulo3 : "Ubica nuestra tienda",
                tituloMarcas : "Aqui coloca un titulo para tus marcas ",
                tituloPrincipal : "Aqui coloca un titulo que llame la atención de tus clientes",
                tituloPrincipalActivo : true,
                urlLogo : "https://firebasestorage.googleapis.com/v0/b/cms-mic.appspot.com/o/almacenamiento%2FaujFJ8lMTLjCtsx3n6hS%2FhSKnxS7cyVFpQsQ5OWGa%2Ficono%20(2).png?alt=media&token=58fb1907-d0db-477b-852c-7dfc9120f3f7",
                apariencia : {
                    colorPrimario: data.colorP,  //  Aqui va el color primario
                    textoColorPrimario: "#A8A8A8",
                    colorSecundario: data.colorS, //  Aqui va el color secundario
                    textoColorSecundario: "#A8A8A8",
                    fondoMenu: data.colorP,  //  Aqui va el color primario
                    botonesMenu: "#A8A8A8", 
                    fondoFooter: data.colorP, //  Aqui va el color primario
                    textoColorFooter: "#A8A8A8" ,
                    tipoLetra: "roboto",
                }
            })

            batch.commit().then(()=>{
                console.log('FIN');
                response.json({code:1 , url : "www." + data.url + ".bixpro.co"});
                return;
            }).catch(err=>{
                response.json({code:0})
                console.log("Error en batch: " + err);
            })
                
            }).catch(err => {
                response.json({code:0})
                console.log("error creando usuario modulo auth: " + err);
            });
            
        }).catch(err => {
            response.json({code:0})
            console.log("Error creando proyecto DB: " + err);
        })

    
    return;
});


export const crearTienda = functions.https.onRequest((request: any, response: any) => {
    if (!request.path) {
        request.url = `/${request.url}`;
    }
    return auth(request, response);
});