const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const low = require('lowdb');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const itemsRouter = require('./routes/items');

const port = process.env.PORT || '6673';

const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ items: [] }).write();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      words: "Library API",
      version: "1.0.0",
      description: "A simple express Library API Doc"
    },
    servers: [
      {
        url: "http://localhost:6673"
      }
    ],
  },
  apis: ["./routes/*.js"],
}

const specs = swaggerJsDoc(options);

const app = express();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.db = db;

app.use(cors());

app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/items", itemsRouter);


app.listen(port, () => {
  console.log(`Express server is running with port: ${port}`);
});
