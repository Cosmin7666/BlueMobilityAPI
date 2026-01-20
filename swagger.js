// swagger.js (nel root)
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const path = require('path');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BlueMobility API",
      version: "1.0.0",
      description: "API con tutte le tabelle e JWT"
    },
    servers: [
      // Cambia con il tuo URL del server
      { url: "http://10.0.1.151:3000/api/v1" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Inserisci il token JWT con il prefisso 'Bearer '"
        }
      }
    },
    security: [
      { bearerAuth: [] } // applica il token a tutte le route che supportano la sicurezza
    ]
  },
  apis: ["./routes/*.js"], // legge i commenti Swagger dentro le routes
};

const swaggerSpec = swaggerJSDoc(options);


function setupSwagger(app) {
  // Serve la cartella swagger per tutorial.js e tutorial.css
  app.use('/swagger', express.static(path.join(__dirname, 'swagger')));

  // Setup Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCssUrl: "/swagger/tutorial.css",
    customJs: "/swagger/tutorial.js"
  }));

  console.log("Swagger pronto su /api-docs");
}


module.exports = setupSwagger;

