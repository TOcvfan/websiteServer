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
    host : 'mysql://mariadb:3306/',
    user : 'user84Y',
    password : 'sdb4Qkg4m5vcD7Yq',
    database : 'sampledb'
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

app.listen(process.env.PORT || 8080, () => {
	console.log(`app is runing on port 8080`)
});
