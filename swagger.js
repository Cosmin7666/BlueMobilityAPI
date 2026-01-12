// swagger.js (nel root)
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BlueMobility API",
      version: "1.0.0",
      description: "API con tutte le tabelle e JWT"
    },
    servers: [
      { url: "http://localhost:3000/api/v1" }
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
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger pronto su /api-docs");
}

module.exports = setupSwagger;
