import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BookMyTicket API",
      version: "1.0.0",
      description: "API documentation for BookMyTicket backend"
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server"
      },
      {
        url: "https://api.bookmytickettemp.xyz",
        description: "Production server"
      }
    ]
  },
  apis: ["./routes/*.js", "./swagger/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUI, swaggerSpec };
