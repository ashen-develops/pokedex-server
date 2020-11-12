/* eslint-disable no-debugger */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const POKEDEX = require('./pokedex.json');

console.log(process.env.API_TOKEN);
const validTypes = ['Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water'];

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next){
//   const bearerToken = req.get('Authorization').split(' ')[1];
  const authToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;

  // console.log('validate bearer token middleware');

  if(!authToken || authToken.split(' ')[1] !== apiToken){
    return res.status(401).json({error: 'Unauthorized request'});
  }
  //   if(bearerToken !== apiToken){
  //     return res.status(401).json({error: 'Unauthorized request'});
  //   }
  //move to the next middleware
  next();
});

app.get('/types', function handleGetTypes(req, res) {
  res.json(validTypes);
});

app.get('/pokemon', function handleGetPokemon(req, res) {
  let response = POKEDEX.pokemon;

  //filter pokemon by name if name query param
  if(req.query.name){
    response = response.filter(pokemon => 
      //case insensitive searching
      pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
    );
  }
  //filter pokemon by type if type query param
  if(req.query.type){
    response = response.filter(pokemon =>
      pokemon.type.includes(req.query.type)
    );
  }
  res.json(response);
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
