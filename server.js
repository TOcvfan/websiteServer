const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : 'TOcvfan1979',
    database : 'facedetectordb'
  }
});

/*db.select('*').from('users').then(data => {
	console.log(data);
});*/

const app = express();

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => {
	res.send('its working');
})

app.post('/signin', signin.handleSignin(db, bcrypt))

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})

app.put('/image', (req, res) => {image.handleImage(req, res, db)})

app.put('/imageUrl', (req, res) => {image.handleApiCall(req, res)})

app.listen(3000, () => {
	console.log('App is running')
});
