'use strict'
/*Probando algunos codigos hasta que sirvan */
//libreria
const LibreriaSGG = require('./LibreriaSGG');
//Ejemplo de una exportacion de una funcion
LibreriaSGG.hola("Ximena");     //utilizando la funcion haslo

//Ejemplo de una respuesta basica
let respuesta = LibreriaSGG.respuestaBasica("Bienvenido a Dialogflow");
console.log(JSON.stringify(respuesta));
console.log(respuesta);

//Ejemplo de una lista de opciones
let opciones = ["opcion1", "opcion2", "opcion3"];
LibreriaSGG.addSugerencias(respuesta, opciones);
console.log(respuesta);
console.log(JSON.stringify(respuesta));

//Ejemplo de una carta de presentacion -card
LibreriaSGG.addCard(respuesta, "Antonio Banderas", "Es un actor", "Antonio Banderas.jpg", "https://es.wikipedia.org/wiki/Antonio_Banderas");
console.log(respuesta);
console.log(JSON.stringify(respuesta));

//Ejemplo para ver si existe el personaje
let personaje;
try {
    personaje = req.body.queryResult.parameters.personaje;
} catch (error) {
    console.log("Error personaje no leido" + error);
}
console.log("personaje" + personaje);

if (typeof (personaje) !== 'undefined') {
    console.log("existe");
} else {
    console.log("no existe");
}
global.listaPersonajes = require("./personajes.json");
// si no existe un elemento de un array es undefined
console.log(global.listaPersonajes["Antonio Banderas"]);
if (global.listaPersonajes["Antonio Banders"]) {
    console.log("personaje Existe");
} else {
    console.log("personaje No Existe");
}// no genera un error de undefined

//Ejemplo Para reducir las opciones
opciones = ["opcion1", "opcion2", "opcion3", "opcion4", "opcion5", "opcion6", "opcion7", "opcion8", "opcion9", "opcion10", "opcion11", "opcion12"];
function reducirAOcho(opciones) {
    let res = []; // array resultado con 8 opciones ordenadas de forma aleatoria
    let i = 0; // contador bucle
    let pos; // posición seleccionada
    while (i < 8 && opciones.length > 0) {
        pos = Math.floor(Math.random() * opciones.length);  //genera una posicion aleatoria
        res.push(opciones[pos]);                            //agrega al array resultado nueva opcion aleatoria
        opciones.splice(pos, 1);                            //borra la opcion aleaoria, para que no se repita
        i++;
    }
    return res;
}
console.log(reducirAOcho(opciones));

//Ejemplo de sentencias para elegir
let tipopc = "sobremesa";
let memoria = "8 Gb";
let discoduro = "1 Tb";
let marcapc = "HP";
console.log((tipopc) ? "hola" : "adios");
console.log(((tipopc) ? "/" + tipopc : "") + ((discoduro) ? "/" + discoduro : "") + ((memoria) ? "/" + memoria : "") + ((marcapc) ? "/" + marcapc : ""));
let url = `https://www.pccomponentes.com+/${tipopc}/${discoduro}/${memoria}/${marcapc}`;
console.log(url);



//Ejemplo de una promise
const http = require('http')       // Importamos la libreria http en la variable: http
const reqUrl = encodeURI('http://datosabiertos.malaga.eu/api/3/action/datastore_search_sql?sql=SELECT count (*) from "0dcf7abd-26b4-42c8-af19-4992f1ee60c6"');

/* Funcion que realiza cuando la promesa es correcta, la operacion es contar los aparcamientos disponibles
 * Entrada:     Respuesta con la base de datos de la url
 * Salida:      texto que via con la respuesta
 */
function accionPromise(respuesta) {
    let textoEnviar;
    console.log("respuesta recibida:" + JSON.stringify(respuesta));
    if (respuesta) {
        textoEnviar = respuesta.result.records[0].count + " aparcamientos";
        console.log("En Málaga hay " + textoEnviar);
    }
}
/**
 * Esta función recibe una dirección y crea una promesa que si es correcta devuelve 
 * la respuesta como parámetro y si no lo es genera un Error
 * Entrada:     url de la que se va a leer la información
 * salida:       
 */
function leerURLpromise(reqUrl) {
    return new Promise((resolve, reject) => {               //regresa una promesa que tiene dos parametros: resolver (correcto) y rechazar (si hay error)
        let textoEnviar = "";                               // codigo que ejecuta para reject     
        http.get(reqUrl, (respuestaDeAPI) => {              //Abrir la URL, el parametro de entrada, la pagina que tiene la base de datos
            let respuestaCompleta = '';
            let respuestaJSON = '';

            respuestaDeAPI.on('data', (chunk) => {          //on es funcion para listen, escuchar o leer un string
                respuestaCompleta += chunk;                 //Del formato de la base de datos, lee, pasalo como string palabra by palabra
            });
            respuestaDeAPI.on('end', () => {                //se ha terminado la url.
                try {                                       //Si existe la url 
                    respuestaJSON = JSON.parse(respuestaCompleta);
                    resolve(respuestaJSON);                                                       //Devuelve un objeto
                }
                catch (error) {                             //No existe la url
                    // En este caso se devolverá la cadena vacía
                    console.log(("Error al cargar los datos del servidor externo" + error));
                    reject(new Error("Error al cargar datos externos"));                           //Devuelve un mensaje error
                    // Esta parte es para trabajar de manera asincrona que dos cousultantes, para que haga una
                    // operacion y no afecte la consulta 
                }
            })
        }).on('error', (error) => {
            // Se ejecutará cuando una petición no es válida
            console.log("Error al cargar los datos del servidor externo", error);
            reject(new Error("Error al cargar datos externos"));

        })
        console.log("leerURL promise texto a Enviar" + JSON.stringify(textoEnviar));    //
    });
}

leerURLpromise(reqUrl).then(accionPromise).catch((error) => {
    console.log("error capturadon en promise" + error);
})
//Llamada de la url, then indica que paso se hace accion promise y tiene parametros, si no manda el error
//primero ejecuta esta prueba