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
    host : 'http://server-database-server-project.7e14.starter-us-west-2.openshiftapps.com/',
    user : 'TOcvfan',
    password : 'TOcvfan1979',
    port: '3306',
    database : 'ch_sampledb'
  }
});

/*db.select('*').from('users').then(data => {
	console.log(data);
	Username: TOcvfan
       Password: f3YI7fWJEOJjiNU
  Database Name: ch_sampledb
  	   port: '22256'
 Connection URL: mysql://mysql:3306/
});*/

const app = express();

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => {
	res.send('its working');
})

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})

app.put('/image', (req, res) => {image.handleImage(req, res, db)})

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(process.env.PORT || 8080, () => {
	console.log(`app is runing on port 8080`)
});
