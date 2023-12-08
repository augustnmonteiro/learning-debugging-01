//Express
const express = require('express');
const app = express();
app.use(express.json())
//Routers
const category = require('./routes/category');
const transaction = require('./routes/transaction');
//Server
const mysql = require('mysql2');
const port = 3001;
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'debug',
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  req.connection = connection;
  next();
});

app.use('/category', category);
app.use('/transaction', transaction);


app.listen(port, () => {
  console.log("Server Running!");
});
