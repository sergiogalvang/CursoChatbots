// Declaracion de peticion
// Copiada de la documentacion de google y checada en json editor en linea
// Agregando el objeto action : input.welcome

let peticion = {
  "responseId": "response-id",
  "session": "projects/project-id/agent/sessions/session-id",
  "queryResult": {
    "queryText": "End-user expression",
    "action": "input.welcome",
    "parameters": {
      "param-name": "param-value"
    },
    "allRequiredParamsPresent": true,
    "fulfillmentText": "Response configured for matched intent",
    "fulfillmentMessages": [
      {
        "text": {
          "text": [
            "Response configured for matched intent"
          ]
        }
      }
    ],
    "outputContexts": [
      {
        "name": "projects/project-id/agent/sessions/session-id/contexts/context-name",
        "lifespanCount": 5,
        "parameters": {
          "param-name": "param-value"
        }
      }
    ],
    "intent": {
      "name": "projects/project-id/agent/intents/intent-id",
      "displayName": "matched-intent-name"
    },
    "intentDetectionConfidence": 1,
    "diagnosticInfo": {},
    "languageCode": "en"
  },
  "originalDetectIntentRequest": {}
}
console.log(peticion.queryResult.action);         //imprime el nombre de laccion que es un objeto
console.log(peticion.queryResult.parameters);     //imprime los parametros es tipo objeto            
console.log(peticion.responseId);                 //imprime el ID de la respuesta

// Declaracion de respuesta a la peticion
let respuesta = {
  "responseId": "d6975390-5ad0-4047-a858-533cb2aa640b-07153d3d",
  "queryResult": {
    "queryText": "hola",
    "action": "input.welcome",
    "parameters": {},
    "allRequiredParamsPresent": true,
    "fulfillmentText": "¡Hey!",
    "fulfillmentMessages": [
      {
        "text": {
          "text": [
            "¡Hey!"
          ]
        }
      }
    ],
    "intent": {
      "name": "projects/intensionesauxiliares-vnsx/agent/intents/ce130de8-8c0d-4b41-8340-7b6e095dca8e",
      "displayName": "Default Welcome Intent"
    },
    "intentDetectionConfidence": 1,
    "languageCode": "es",
    "sentimentAnalysisResult": {
      "queryTextSentiment": {
        "score": 0.1,
        "magnitude": 0.1
      }
    }
  }
}
console.log("Respuesta de la peticion: ");                      //impresion de respuesta
console.log(respuesta);
respuesta.queryResult.fulfillmentText = "Buenas tardes";        //Cambio de respuesta al objeto
console.log("Respuesta de la peticion despues del cambio:");
console.log(respuesta);                                         //impresion de respuesta

// Añadir nuevos elementos a una respuesta, una sugerencia
respuesta.queryResult.fulfillmentMessages.push({                  //pegando el codigo de sugerencia en push
  "platform": "ACTIONS_ON_GOOGLE",
  "suggestions": {
    "suggestions": [
      {
        "title": "Chiste"
      },
      {
        "title": "Consejo"
      },
      {
        "title": "Noticias"
      },
      {
        "title": "Mi equipo de futbol"
      }
    ]
  }
})
console.log("Respuesta despues de la suggestion");
console.log(respuesta);
console.log(JSON.stringify(respuesta.queryResult.fulfillmentMessages));   //Vuelve cadena la sugerencia para mostrarla