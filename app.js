// Require the express module
const express = require('express');
// Create a new web server
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Tell the web server to serve files
// from the www folder
app.use(express.static('www'));
// Start the web server on port 3000
//app.use(express.json({extended: true}));
//app.use(express.urlencoded({extended: true}));


app.listen(3000,() => console.log('Listening on port 3000'));

const IngredientData = require('./classes/ingredientData.class');

let ingredientDataJson= require('./json/livsmedelsdata.json');

ingredientDataJson = ingredientDataJson.map(obj => new IngredientData(obj));

let Routes = require('./classes/routes.class');

new Routes (app, ingredientDataJson);