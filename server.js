const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

/*const db = knex({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : 'TOcvfan1979',
    port: '3306',
    database : 'facedetectordb'
  }
});*/

const db = knex({
  client: 'mysql',
  connection: {
    host : 'us-cdbr-iron-east-03.cleardb.net',
    user : 'b40765b50e7aab',
    password : '5aeb91de',
    port: '3306',
    database : 'heroku_6df70833f09744a'
  }
});


const app = express();

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => {
	res.send('it is working');
})

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})

app.put('/image', (req, res) => {image.handleImage(req, res, db)})

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3001, () => {
	console.log(`App is running on ${process.env.PORT}`)
});