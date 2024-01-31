const dotenv = require('dotenv');
dotenv.config();
const express = require('express');

const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const upload = require('express-fileupload');
const inLineCss = require('nodemailer-juice');
const dbUsername = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
if (!dbUsername) {
  throw new Error('DB_USERNAME environment variables must be set');
}

if (!dbPassword) {
  throw new Error('DB_PASSWORD environment variables must be set');
}

const stjerner = require('./controller/citraef/stjerner');
const beskriv = require('./controller/citraef/beskrivelse');
const hentstjerner = require('./controller/citraef/hentStjerner');
const hentMad = require('./controller/aftensmad/hentmad');
const hentOpskrift = require('./controller/aftensmad/hentOpskrift');
const hentRet = require('./controller/aftensmad/hentRet');
const opskrift = require('./controller/aftensmad/opretOpskrift')
const ret = require('./controller/aftensmad/opretRet')
const opdaterbillede = require('./controller/aftensmad/billeder');
const nytester = require('./controller/MinSide/nytester');
const tester = require('./controller/MinSide/antaltestere');
const kommentarer = require('./controller/MinSide/appkommentarer');
const register = require('./controller/MinSide/register');
const signin = require('./controller/MinSide/signin');
//const protected = require('./controller/MinSide/protected')
const profile = require('./controller/MinSide/profile');
const hentLinks = require('./controller/MinSide/links')
const hentUddLinks = require('./controller/MinSide/uddLinks');
const postauth = require('./controller/MinSide/postauth');
const post = require('./controller/MinSide/post');
const hentBrugere = require('./controller/MinSide/brugere');
const ikkevismail = require('./controller/MinSide/mail');
const gaestebog = require('./controller/MinSide/gaestebog');
const rediger = require('./controller/MinSide/rediger');
const pass = require('./controller/MinSide/password');
const glemtpass = require('./controller/MinSide/glemtpass');
const kodemail = require('./controller/MinSide/kodeviamail');

const mail = require('./controller/shop/mail');
const cv = require('./controller/MinSide/cv')

const nyBenzin = require('./controller/benzin/nyBenzin')
const hentBenzin = require('./controller/benzin/hentBenzin')
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
const PORT = process.env.PORT || 3001;

const bookshelf = require('bookshelf');
const securePassword = require('./middleware/bookshelf-secure-password');
const db = bookshelf(knexDb);
db.plugin(securePassword);
const path = require('path')
app.use(upload({
  createParentPath: true
}));
const dateZero = (d) => d < 10 ? '0' + d : '' + d;

const fileName = dateZero(new Date().getDate()) + dateZero(new Date().getMonth() + 1) + new Date().getFullYear() + '_';
app.use(express.static('public'));
app.use(`*/profilbilleder`, express.static(`public/profilbilleder`));
app.use('/aftensmad', express.static(path.join(__dirname, 'public', 'aftensmad')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const User = db.Model.extend({
  tableName: 'bruger',
  hasSecurePassword: true
});

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_OR_KEY
};

/*app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
})*/

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

app.get('/tester', (req, res) => {
  const table = 'test'
  knexDb(table).select('*')
    .then(t => {
      if (t.length) {
        res.json({ message: 'ok', error: false })
      } else {
        res.status(400).json({ message: t, error: true })
      }
    })
    .catch(err => res.status(400).json({ message: err, error: true }))
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

app.post('/nyopskrift', (req, res) => { opskrift.nyOpskrift(req, res, knexDb, dotenv, fileName) })

app.post('/nyret', (req, res) => { ret.nyRet(req, res, knexDb, dotenv, fileName) })

app.get('/retter', (req, res) => { hentMad.opskriftNavne(res, knexDb) })

app.get('/ret/:id', (req, res) => { hentRet.ret(res, req, knexDb) })

app.get('/opskrift/:id', (req, res) => { hentOpskrift.opskrift(res, req, knexDb) })

app.put('/billede/til/ret', (req, res) => { opdaterbillede.nytBillede(req, res, knexDb, dotenv, fileName, "ret") })
app.put('/billede/til/opskrift', (req, res) => { opdaterbillede.nytBillede(req, res, knexDb, dotenv, fileName, "opskrift") })

app.post('/nytester', (req, res) => { nytester.gemtester(req, res, knexDb, dotenv, nodemailer, inLineCss) })

app.get('/antaltestere', (req, res) => { tester.antal(req, res, knexDb, dotenv) })

app.post('/kommentar', (req, res) => { kommentarer.mailOmApp(req, res, nodemailer, inLineCss, dotenv) })

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`)
});