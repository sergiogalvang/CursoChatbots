'use strict'
// Importacion de librerias
/*const functions = require('firebase-functions');*/
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
//Importacion de Mi libreria de mis funciones SGG
const LibreriaSGG = require('./LibreriaSGG');             //cargada


//
//  Variables Globales
global.listaPersonajes = require("./personajes.json");        //La lista de personajes en el archivo
global.imagenes = "https://cursochatbots-sgg.herokuapp.com/imagenes/"    //Cargar Imagenes del directorio
global.ponentes = require("./ponentes.json");                   //Lista de ponentes
//
// INICIO DE CODIGO

const server = express();                             //Declaracion del servidor, server es una variable

server.use(bodyParser.urlencoded({ extended: true }))   //usa bodyparser para leer url y codificarla

server.use(bodyParser.json());                        // Servidor usa parser para leer archivos .json

server.use("/imagenes", express.static(path.join(__dirname + '/imagenes')))
// Usa la funcion express.static para leer de forma estatica
// Usa path para dar la direccion de la imagen
// __dirname va la direccion 

//Acceso incorrecto entraron desde un navegador
server.get('/', (req, res) => { return res.json("Hola, Peticion con get, incorrecto, esta no es la forma de interactuar conmigo"); });

//Acceso correcto para entrar al servidor
server.post("/curso", (req, res) => {

    //Variables para la respuesta de la peticion
    let contexto = "nada";
    let resultado;
    let textoEnviar = `Recibida peticion post`;
    let opciones = LibreriaSGG.reducirAOcho(["chiste", "Consejo", "Noticias", "Mi Equipo", "Personaje"]);
    let respuestaEnviada = false;

    /*Inicio de peticiones pueden ser 
            1. Accion (Verificacion del contexto)
            2. Parametros ()
            3. Bienvenida  (inicio de contextos)
            4. Personajes Descripciones
            5. Listado de personajes (sugerencia personajes de nuestro archivo)
            6. Ejercicio de menu
            7. Recomendar ordenador
            8. Contar numero de aparcamientos con APIs
            9. Disponibilidad de Aparcamientos
            10.Informacion de ponentes
     */

    //  1.  Verificacion del contexto
    try {
        contexto = req.body.queryResult.action;
        textoEnviar = `recibida petición de ${contexto}`;
    }
    catch (error) {
        console.log("Error contexto vacio:" + error);
    }

    //  2.  Verificacion de parametros
    if (req.body.queryResult.parameters) {
        console.log("parametros: " , req.body.queryResult.parameters);
        textoEnviar = textoEnviar + " y el parametro es prueba: " + req.body.queryResult.parameters;
    }
    else {
        console.log("Sin parametros");
    }

    //  3.  Bienvenida
    if (contexto === "input.welcome") {
        textoEnviar = "Hola soy el primer webhook";
        resultado = LibreriaSGG.respuestaBasica(textoEnviar);
    }

    // 4.   Busqueda de personajes
    else if (contexto === "personaje") {
        let personaje;
        try {
            personaje = req.body.queryResult.parameters.personaje;      //Si existe el personaje
        }
        catch (error) {                                               //si no existe, personaje=undefined
            console.log("Error personaje no leido" + error);
        }
        if (personaje) {
            let arListaPersonajes = Object.keys(global.listaPersonajes);
            //Vamos a personalizar las opciones para que aparezcan como sugerencias: otros personajes y el menu
            opciones = arListaPersonajes.slice();
            opciones.unshift("menu");
            // si ha llegado parametro personaje y esta en la lista de nuestro archivo
            if (global.listaPersonajes[personaje]) {
                textoEnviar = global.listaPersonajes[personaje];        //cargando en nuestro directorio
                let imagen = encodeURI(global.imagenes + personaje + ".jpg");
                let url = "https://www.google.com/search?q=" + personaje;
                resultado = LibreriaSGG.respuestaBasica(`Me encanta ${personaje}`);
                LibreriaSGG.addCard(resultado, personaje, textoEnviar, imagen, url)
            }
            else {
                //si el personaje recibido no esta en la lista de personaje
                resultado = LibreriaSGG.respuestaBasica(`Lo siento todavia no he aprendido nada de ${personaje}. Seguiré estudiando`);
            }
        }
        else {
            resultado = LibreriaSGG.respuestaBasica("No conozco a ese personaje");  //personaje vacio
        }
    }

    //5.  Listado de personajes
    else if (contexto === "lista_personajes") {
        let arListaPersonajes = Object.keys(global.listaPersonajes);
        //Vamos a personalizar las opciones para que aparezcan como sugerencias: otros personajes y el menu
        opciones = arListaPersonajes.slice();
        opciones.unshift("menu");
        resultado = LibreriaSGG.respuestaBasica("Te muestro algunos personajes que conozco...");
    }

    //6.   Ejercicio de menu
    else if (contexto === "menu") {
        resultado = LibreriaSGG.respuestaBasica("Te muestro algunas cosas que se hacer, ya quedo:");
    }

    //7.   Recomendar ordenador
    else if (contexto === "recomendar_ordenador") {
        let tipopc;
        let memoria;
        let discoduro;
        let marcapc;
        try {
            tipopc = req.body.queryResult.parameters.tipopc;        //Va a haber algunas que no tengan valor
            memoria = req.body.queryResult.parameters.memoria;
            marcapc = req.body.queryResult.parameters.marcapc;
            discoduro = req.body.queryResult.parameters.discoduro;
        }
        catch (error) {
            console.log("cargando variables:" + error);
        }
        // LLenar las variables que esten vacias, le preguntamos al usuario
        if (!tipopc) {
            textoEnviar = "Que tipo de dispositivo te gustaría elegir:";
            opciones = ["sobremesa", "portatiles"];
            resultado = LibreriaSGG.respuestaBasica(textoEnviar);
        } else if (!memoria) {
            textoEnviar = "Es necesario elegir el tamaño de la memoria:";
            opciones = ["4 Gb", "8 Gb", "16 Gb", "32 Gb"];
            resultado = LibreriaSGG.respuestaBasica(textoEnviar);
        } else if (!discoduro) {
            textoEnviar = "Ahora veremos el almacenamiento en disco:";
            opciones = ["1-tb", "2-tb", "4-tb","5-tb"];
            resultado = LibreriaSGG.respuestaBasica(textoEnviar);
        } else if (!marcapc) {
            textoEnviar = "Vamos a ver que marca te gustaría consultar:";
            opciones = ["hp", "lenovo", "msi", "acer", "dell"];
            resultado = LibreriaSGG.respuestaBasica(textoEnviar);
        } else {
            // Se tienen los 4 parametros y se puede realizar la búsqueda del PC
            resultado = LibreriaSGG.respuestaBasica("Te ayudaré a encontrar un ordenador con esas características");
            let url = 'https://www.pccomponentes.com' + ((tipopc) ? "/" + tipopc : "") + ((discoduro) ? "/" + discoduro : "") + ((memoria) ? "/" + memoria : "") + ((marcapc) ? "/" + marcapc : "");
            LibreriaSGG.addEnlace(resultado, `Ver recomendación`, url);
            opciones = ["menu"];    //Hacemos que las sugerencias no aparezcan para que la recomendacion no este al final
        }
    }

    //8.    Contar Numero de aparcamientos con APIs
    else if (contexto === "aparcamientos_contar") {
        respuestaEnviada = true;                                            //ya se envio la llamada res.json
        const reqUrl = "https://datosabiertos.malaga.eu/api/3/action/datastore_search_sql?sql=SELECT count (*) from 0dcf7abd-26b4-42c8-af19-4992f1ee60c6";
        LibreriaSGG.leerURLpromise(reqUrl).then((respuesta) => {            //funcion implicita de la respuesta que va a regresar, json completo
            let resultado;
            textoEnviar = respuesta.result.records[0].count + " aparcamientos"; //operacion que cua
            console.log(("En Málaga hay " + textoEnviar));
            resultado = LibreriaSGG.respuestaBasica(textoEnviar);
            LibreriaSGG.addSugerencias(resultado, opciones);
            res.json(resultado);                                            //La llamada a res.json() es solo una vez
            return true;

        }).catch((error) => {                                           //Error cuando no haya una variable undefined
            console.log("error capturado en promise:" + error);
            res.json(LibreriaSGG.respuestaBasica("Lo siento. No puedo contactar con servidor externo"));

        });
    }

    //9.    Ocupacion de aparcamientos
    else if (contexto === "aparcamientos_ocupacion") {
        const aparcBuscado = req.body.queryResult.parameters.nombre;        //Esperar que reciba el parametro a buscar, leer
        console.log("aparcBuscado=" + aparcBuscado);                        //lee el apartado buscado
        //crea la url que busca el apartado
        const reqUrl = encodeURI(`http://datosabiertos.malaga.eu/api/3/action/datastore_search_sql?sql=SELECT * from "0dcf7abd-26b4-42c8-af19-4992f1ee60c6" WHERE upper(nombre) LIKE upper('%${aparcBuscado}%')`);
        console.log(reqUrl);
        //repuesta enviada, para ejecutar aqui el res.json
        respuestaEnviada = true;
        LibreriaSGG.leerURLpromise(reqUrl).then((respuesta) => {        //leer la promise
            let resultado;
            textoEnviar;
            console.log("leerURLpromise:" + JSON.stringify(respuesta)); //Imprime la informacion que se recibe como en postman
            const aparcamiento = respuesta.result.records[0];           //EL primer parametro del apartado
            console.log("leerURLpromise-aparcamiento:" + aparcamiento); //Se muestra el array de records de base de datos
            if (aparcamiento.libres > 0) {                              //si ya tenemos el aparcamiento buscado, si hay aparcamientos libres
                textoEnviar += `${aparcamiento.nombre} situado en ${aparcamiento.direccion} dispone de ${aparcamiento.capacidad} plazas y ahora tiene ${aparcamiento.libres} libres. Corre y no pierdas tu sitio`;
            } else {                                                    //Si no hay disponibilidad de aparcamiento
                textoEnviar += `${aparcamiento.nombre} situado en ${aparcamiento.direccion} dispone de ${aparcamiento.capacidad} plazas y ahora está lleno. Espera un poquito o prueba con otro aparcamiento`;
            }
            console.log("Resultado aparcamientos: " + textoEnviar);     //muestra el resultado que envia
            resultado = LibreriaSGG.respuestaBasica(textoEnviar);       //respuesta a dialogflow con sugerencias
            LibreriaSGG.addSugerencias(resultado, opciones);
            res.json(resultado);
            return true;                                                //Regresa la respuesta de promise correcta
        }).catch((error) => {                                           // Regresa la respuesta de promise incorrecta
            console.log("error capturado en promise:" + error);
            res.json(LibreriaSGG.respuestaBasica("Lo siento. No encuentro ese aparcamiento"));
        });
    }

    //10.   Informacion de ponentes
    else if (contexto === "ponente") {
        try {                                           //si conoce el ponente
            let ponente = "";
            ponente = req.body.queryResult.parameters.ponente;
            //Texto de nombre, cargo, institucion
            textoEnviar = ponente + " es " + global.ponentes[ponente].Cargo + " en " + global.ponentes[ponente].Institucion;
            //Imagen del ponente
            let imagen = global.ponentes[ponente].Imagen;
            let url = global.ponentes[ponente].url;
            //Creamos La Carta de presentacion Card con los parametros del ponente y el texto que responde
            resultado = LibreriaSGG.respuestaBasica(textoEnviar);
            LibreriaSGG.addCard(resultado, ponente, textoEnviar, imagen, url);

            //Crea Una lista de sugerencia de ponentes de la lista de la variable global ponentes
            let arListaPonentes = Object.keys(global.ponentes).slice();
            // Vamos a personalizar las opciones para que aparezcan como sugerencias otros ponentes y el menu
            opciones = LibreriaSGG.reducirAOcho(arListaPonentes.slice());
            opciones.unshift("menu");   //agraga el menu al inicio
        }
        catch (error) {                                                 // Si no conoce el ponente
            textoEnviar = "No conozco ese ponente";
            resultado = LibreriaSGG.respuestaBasica(textoEnviar);
        }

    }

    //Ultimos mensajes
    else {
        //Se recibe una action desconocida (contexto)
        resultado = LibreriaSGG.respuestaBasica(`Todavia no he aprendido a gestionar: ${contexto}`);
    }
    if (!respuestaEnviada) {        //Si no hay respuesta enviada, envia sugerencias
        //Enviando una lista de sugerencias
        LibreriaSGG.addSugerencias(resultado, opciones);
        //Enviando la Ultima Respuesta
        res.json(resultado);
    }
});

// FIn del acceso con post

server.listen((process.env.PORT || 8000), () => { console.log("Servidor funcionando"); });