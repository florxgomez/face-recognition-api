const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const { handleRegister } = require('./controllers/register');
const { handleSignIn } = require('./controllers/signin');
const { handleProfile } = require('./controllers/profile');
const { handleImage, handleApiCall } = require('./controllers/image');

const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'Flor',
		password: '',
		database: 'face-recognition'
	}
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send(db.select('*').from('users')) })
app.post('/signIn', handleSignIn( db, bcrypt))
app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => { handleProfile(req, res, db) });
app.put('/image', (req, res) => { handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { handleApiCall(req, res, db) });

app.listen(3000, () => { console.log('app is running on port 3000') })

/*
API Endpoints
/ --> res = this is working
/signIn --> POST = success/error logging in
/register --> POST = new user
/profile/:userId --> GET = user
/image --> PUT --> user (count)
*/