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
    host : '206.189.226.237',
    user : 'root',
    password : 'f3YI7fWJEOJjiNU',
    port: '22256',
    database : 'ch_sampledb'
  }
});

/*db.select('*').from('users').then(data => {
	console.log(data);
	Username: TOcvfan
       Password: TOcvfan1979
  Database Name: sampledb
 Connection URL: mysql://mysql:3306/
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
