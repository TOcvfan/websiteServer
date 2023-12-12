const dotenv = require('dotenv');
dotenv.config();
const express = require('express');

const app = new express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const inLineCss = require('nodemailer-juice');
const dbUsername = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
//const mqtt = require('mqtt');
if (!dbUsername) {
  throw new Error('DB_USERNAME environment variables must be set');
}

if (!dbPassword) {
  throw new Error('DB_PASSWORD environment variables must be set');
}

const stjerner = require('./controllers/citraef/stjerner');
const beskriv = require('./controllers/citraef/beskrivelse');
const hentstjerner = require('./controllers/citraef/hentStjerner');

const register = require('./controllers/MinSide/register');
const signin = require('./controllers/MinSide/signin');
//const protected = require('./controllers/MinSide/protected')
const profile = require('./controllers/MinSide/profile');
const hentLinks = require('./controllers/MinSide/links')
const hentUddLinks = require('./controllers/MinSide/uddLinks');
const postauth = require('./controllers/MinSide/postauth');
const post = require('./controllers/MinSide/post');
const hentBrugere = require('./controllers/MinSide/brugere');
const ikkevismail = require('./controllers/MinSide/mail');
const gaestebog = require('./controllers/MinSide/gaestebog');
const rediger = require('./controllers/MinSide/rediger');
const pass = require('./controllers/MinSide/password');
const glemtpass = require('./controllers/MinSide/glemtpass');
const kodemail = require('./controllers/MinSide/kodeviamail');

const mail = require('./controllers/shop/mail');
const cv = require('./controllers/MinSide/cv')

/*const arbejdsseddel = require('./controllers/arbejdsseddel/arbejdsseddel');
const brianbruger = require('./controllers/arbejdsseddel/brianOpret');
const brianlogin = require('./controllers/arbejdsseddel/brianlogin');

const nykm = require('./controllers/km/nykm');
const kmlogin = require('./controllers/km/km_login');
const kmOpret = require('./controllers/km/km_register');
const kmListe = require('./controllers/km/kmListe');
const sendKm = require('./controllers/km/sendKm');
const delKm = require('./controllers/km/delKm');
const nyalarm = require('./controllers/km/nyAlarm');
const sendalarm = require('./controllers/km/sendAlarm');
const henteBruger = require('./controllers/km/hentBruger');
const opdaterBruger = require('./controllers/km/opdaterBruger');
const henteNavne = require('./controllers/km/hentNavne');
const hentByer = require('./controllers/km/hentByer');
const nytSted = require('./controllers/km/nytSted');
const fjernBy = require('./controllers/km/delSted');*/
const nyBenzin = require('./controllers/benzin/nyBenzin')
const hentBenzin = require('./controllers/benzin/hentBenzin')
const passport = require('passport');
const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const knex = require('knex');
const knexDb = knex({
  client: 'mysql2',
  connection: {
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB
  }
});
const PORT = process.env.PORT || 3002;
/*
const options = {
  protocol: 'mqtts',
  host: '0c318c3035dc4ef7996dc6d40bbc80b5.s2.eu.hivemq.cloud',
  port: 8883,
  username: 'TOcvfan1979',
  password: 'Fisse2021!'

};

const client = mqtt.connect(options);

*/
const bookshelf = require('bookshelf');
const securePassword = require('./middleware/bookshelf-secure-password');
const db = bookshelf(knexDb);
db.plugin(securePassword);

const User = db.Model.extend({
  tableName: 'bruger',
  hasSecurePassword: true
});

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_OR_KEY
};

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

const strategy = new JwtStrategy(opts, (payload, next) => {
  User.forge({ role: payload.role, id: payload.id }).fetch().then(res => {
    next(null, res);
  });
});

passport.use(strategy);
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());

const auth = passport.authenticate('jwt', { session: false });

//min side 
//client.subscribe('location/gps/vehicle1');

app.get('/tester', (req, res) => {
  const table = 'test'
  console.log(table)
  knexDb(table).select('*')
    .then(t => {
      if (t.length) {
        res.json('ok')
      } else {
        res.status(400).json('ingen forbindelse')
      }
    })
    .catch(err => res.status(400).json(err + ' error getting list'))
  /*
  
    client.publish('cluster/messages', 'Hello, HiveMQ', (err) => {
      if (err) {
        console.error('Failed to publish message:', err);
      } else {
        console.log('Message published with retain flag set to true');
      }
    });
    client.on('message', (topic, message) => {
      console.log(`Received message on topic ${topic}: ${message}`);
    });
    //Publish a message and assign a alias to the topic
    client.publish('location/gps/vehicle1', 'Hello, HiveMQ!', { topicAlias: 1 });
  
    // On the next publish, the topic alias value will be used (instead of the entire topic string) when communicating with the broker
    client.publish('location/gps/vehicle1', 'Still here, HiveMQ!');
    */
})

app.post('/newuser', async (req, res) => { register.handleRegister(req, res, User, jwt, dotenv, knexDb) })

app.put('/userprofile/:id', auth, (req, res) => { profile.handleProfile(req, res, knexDb, jwt, dotenv) })

app.post('/login', (req, res) => { signin.handleSignin(req, res, knexDb, bcrypt, jwt, dotenv) })

app.put('/redigerdyr/:id', auth, (req, res) => { rediger.redigering(req, res, knexDb, jwt, dotenv, 'dyr') })

app.put('/redigerpassword', (req, res) => { pass.nytPassword(req, res, knexDb, bcrypt, dotenv) })

app.get('/users', auth, (req, res) => { hentBrugere.handleUsers(req, res, knexDb, jwt, dotenv) })

app.get('/links', (req, res) => { hentLinks.links(req, res, knexDb) })

app.get('/gaestebog', (req, res) => { gaestebog.opslag(req, res, knexDb) })

app.get('/uddlinks', (req, res) => { hentUddLinks.uddlinks(req, res, knexDb) })

app.post('/nytlink', auth, (req, res) => { postauth.nyAuthPost(req, res, knexDb, jwt, dotenv, 'link') })

app.post('/nytgaestebogpost', (req, res) => { post.nyPost(req, res, knexDb, dotenv, 'gaestebog') })

app.post('/ikkevismigmail', (req, res) => { ikkevismail.gaestebogMail(req, res, nodemailer, inLineCss) })

app.post('/glemtkodeord', (req, res) => { glemtpass.glemtPassword(req, res, nodemailer, inLineCss, knexDb, jwt, dotenv) })

app.put('/kodeviamail/:id', auth, (req, res) => { kodemail.nytPassword(req, res, knexDb, bcrypt, dotenv, jwt) })

//citræf
app.post('/stjerner', (req, res) => { stjerner.handleStjerner(req, res, knexDb) })

app.post('/beskrivelser', (req, res) => { beskriv.handleBeskrivelse(req, res, nodemailer) })

app.get('/hentstjerner', (req, res) => { hentstjerner.handleHentStjerner(req, res, knexDb) })

//shop

app.post('/contact', (req, res) => { mail.handleEmailFromShop(req, res, nodemailer) })

app.post('/cvcontact', (req, res) => { cv.handleEmailFromCV(req, res, nodemailer, inLineCss) })

//benzin app

app.get('/hentpriser', (req, res) => { hentBenzin.handleHentBenzin(req, res, knexDb) })

app.post('/nypris', (req, res) => { nyBenzin.handleBenzin(req, res, knexDb) })

//jbsikring ting

/*app.post('/nykmtilfoejelse/:id', (req, res) => { nykm.handleKm(req, res, knexDb) })

app.get('/kmliste/:id', auth,(req, res) => { kmListe.handleKmListe(req, res, knexDb) })

app.post('/kmopret', async (req, res) => { kmOpret.handleKmRegister(req, res, KmUser, jwt, dotenv) })

app.post('/kmlogin', (req, res) => { kmlogin.handleKmLogin(req, res, knexDb, bcrypt, jwt, dotenv) })

app.patch('/nyalarm/:id', auth,(req, res) => { nyalarm.handleAlarm(req, res, knexDb) })

app.post('/sendKm', auth,(req, res) => { sendKm.handleSendKm(req, res, nodemailer, inLineCss) })

app.delete('/removelist/:id', (req, res) => { delKm.handleDelKm(req, res, knexDb) })

app.post('/sendalarmer', auth,(req, res) => { sendalarm.handleSendAlarmer(req, res, nodemailer, inLineCss) })

app.get('/hentbyer', (req, res) => { hentByer.handleHentByer(req, res, knexDb) })

app.post('/nytsted', (req, res) => { nytSted.handleNytSted(req, res, knexDb) })

app.delete('/fjernBy/:id', (req, res) => { fjernBy.handleFjernBy(req, res, knexDb) })

app.get('/hentbruger/:id', (req, res) => { henteBruger.handleBruger(req, res, knexDb) })

app.get('/hentnavne', (req, res) => { henteNavne.handleNavne(req, res, knexDb) })

app.patch('/opdaterbruger/:id', (req, res) => { opdaterBruger.handleOpdBruger(req, res, knexDb) })

app.post('/arbejdsseddel', (req, res) => { arbejdsseddel.handleArbejdsseddel(req, res, nodemailer) })

app.post('/brianopret', (req, res) => { brianbruger.handleBrianOpret(req, res, knexDb, brianUser, dotenv) })

app.post('/brianlogin', (req, res) => { brianlogin.handleBrianLogin(req, res, knexDb, bcrypt, jwt, dotenv) })*/

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`)
});