const express = require('express');
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const bcrypt = require('bcrypt-nodejs');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const bday = require('./controllers/bday');
const list = require('./controllers/list');
const offerGet = require('./controllers/food/offer');
const offerPost = require('./controllers/food/offerPost');
const offerlist = require('./controllers/food/offerlist');
const offerDel = require('./controllers/food/offerDel');
const registerFood = require('./controllers/food/registerFood');
const signinFood = require('./controllers/food/signinFood');
const productPost = require('./controllers/food/productpost');
const productlist = require('./controllers/food/productlist');
const orderlist = require('./controllers/food/orderlist');
const orderpost = require('./controllers/food/orderPost');
const test = require('./controllers/food/test');

const db = knex({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : 'TOcvfan1979',
    port: '3306',
    database : 'facedetectordb'
  }
});
/*
const db = knex({
  client: 'mysql',
  connection: {
    host : 'us-cdbr-iron-east-03.cleardb.net',
    user : 'b40765b50e7aab',
    password : '5aeb91de',
    port: '3306',
    database : 'heroku_6df70833f09744a'
  }
});*/


const app = express();

app.engine('handlebars', exphbs());
//app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => {
	res.send(`App is running on ${process.env.PORT}`);
})

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})

app.put('/image', (req, res) => {image.handleImage(req, res, db)})

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

//fødselsdagsside

app.post('/birthday', (req, res) => {bday.handleBdayRegistraition(req, res, db)})

app.get('/list', (req, res) => {list.handleGuests(req, res, db)})

//pizzaside

app.post('/signinFood', (req, res) => {signinFood.handleSigninFood(req, res, db, bcrypt)})

app.post('/registerFood', (req, res) => {registerFood.handleRegisterFood(req, res, db, bcrypt)})

app.get('/offer/:offerNumber', (req, res) => {offerGet.handleOffersGet(req, res, db)})

app.get('/offerGet', (req, res) => {offerlist.handleOfferGet(req, res, db)})

app.post('/offerPost', (req, res) => {offerPost.handleOfferPost(req, res, db)})

app.delete('/offerDel/:offerNumber', (req, res) => {offerDel.handleOfferDel(req, res, db)})

//order:post
app.post('/orderpost', (req, res) => {orderpost.handleOrdersPost(req, res, db)})
//order:get
app.get('/orderGet', (req, res) => {orderlist.handleOrderGet(req, res, db)})
//order:put

//order:delete

app.post('/productpost', (req, res) => {productPost.handleProductPost(req, res, db)})

app.get('/productGet', (req, res) => {productlist.handleProductGet(req, res, db)})

app.post('/send', (req, res) => {test.handleEmail(req, res, exphbs, nodemailer, db)})

app.listen(process.env.PORT || 3001, () => {
	console.log(`App is running on ${process.env.PORT}`)
});