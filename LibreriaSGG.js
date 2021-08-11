//Libreria
const http = require('http');

/* Crea una funcion basica apartir de un texto
* entrada:  textoEnviar 
* salida:   la cadena json de la respuesta
*/
function respuestaBasica(textoEnviar) {
    let respuesta = {
        "fulfillmentText": textoEnviar,
        "fulfillmentMessages": [
            {
                "platform": "ACTIONS_ON_GOOGLE",
                "simpleResponses": {
                    "simpleResponses": [
                        {
                            "textToSpeech": textoEnviar
                        }
                    ]
                }
            },
            {
                "text": {
                    "text": [
                        textoEnviar
                    ]
                }
            }
        ]
    }
    return respuesta;
}

/** Añade una respuesta basica la lista de sugerencias
 *  Entrada:   Es la lista de sugerencia a añadir a res con el formato
 *  Salida:      ["opcion1","opcion2",...,"opcionn"] 
 */
function addSugerencias(respuesta, opciones) {
    respuesta.fulfillmentMessages.push({
        "platform": "ACTIONS_ON_GOOGLE",
        "suggestions": {
            "suggestions": listaOpcionesGoogle(opciones)
        }
    });
}

/**Crea una carta de presentacion de dialogflow
 * Entradas:    
 *     res Añade una respuesta basica
 *     titulo titulo
 *     texto principal
 *     imagen asociada
 *     url url asociada
 * Salida: El codigo para generar una carta de presentacion con los datos de entrada asociados
 */
function addCard(res, titulo, texto, imagen, url) {
    res.fulfillmentMessages.push({
        "platform": "ACTIONS_ON_GOOGLE",
        "basicCard": {
            "title": titulo,
            "subtitle": titulo,
            "formattedText": texto,
            "image": {
                "imageUri": imagen,
                "accessibilityText": titulo
            },
            "buttons": [
                {
                    "title": `Más infomacion ${titulo}`,
                    "openUriAction": {
                        "uri": url
                    }
                }
            ]
        }
    });
}

/* Añade un enlace en los mensajes, link out en dialogflow
 * Entradas: 
 *      Respuesta a la que se añade el enlace, resultado
 *      El texto asociado al enlace
 *      La direccion del enlace, URL
 * Salida: 
 *      El codigo Json del link out
 */
function addEnlace(res, texto, url) {
    res.fulfillmentMessages.push({
        "platform": "ACTIONS_ON_GOOGLE",
        "linkOutSuggestion": {
            "destinationName": texto,
            "uri": url
        }
    });
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


/** Es una funcion no exportada que se ocupa para generar una lista de opciones
 * entrada:  Recibe la lista de opciones
 * salida:   Devuelve  el codigo de la lista en formato suggestions de google
 *          [{"title":"Valor"},...]
 */
function listaOpcionesGoogle(opciones) {
    let res = [];
    for (let i = 0; i < opciones.length; i++) {
        res.push({ "title": opciones[i] })
    }
    return res;
}

/* Reduce a ocho opciones un arreglo de sugerencias que es el minimo que acepta dialogflow
* Entradas:  Lista de opciones 
* Salida:    Lista de opciones aleatorias length = 8 ["opcion1",...,"opcion8"]
*/
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
//Ejemplo de una exportacion de una funcion
function haslo(nombre) {
    console.log("Encantado de conocerte " + nombre);
}


//La manera en la que se van a exportar
// Llamado a la funcion  :  Nombre de la funcion que va a ocupar
module.exports = {
    hola: haslo,
    respuestaBasica: respuestaBasica,
    addSugerencias: addSugerencias,
    addCard: addCard,
    reducirAOcho: reducirAOcho,
    addEnlace:addEnlace,
    leerURLpromise:leerURLpromise
};