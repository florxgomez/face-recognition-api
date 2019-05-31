const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const saltRounds = 10;

const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'Flor',
		password: '',
		database: 'face-recognition'
	}
});

/* db.select('*').from('users').then(data => {
	console.log(data);
}); */

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
	users: []

}

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signIn', (req, res) =>{
/*bcrypt.compare('apples', '$2b$10$p7D7SmlWSYsF4p7ZUgHkh.DY0ZHFdT2hCVjgKft/mI227bgGKFeuO', function(err, res){
	console.log('first guess', res)
})

bcrypt.compare('veggies', '$2b$10$p7D7SmlWSYsF4p7ZUgHkh.DY0ZHFdT2hCVjgKft/mI227bgGKFeuO', function(err, res){
	console.log('second guess', res)
})*/

	if(req.body.email === database.users[0].email && 
		req.body.password === database.users[0].password){
		res.json(database.users[0]);
	} else {
		res.status(400).json('error logging in');
	}
})

app.post('/register', (req, res) =>{
const { email, name, password } = req.body;
bcrypt.hash(password, saltRounds, function(err, hash){
	console.log(hash);
});
	db('users')
	 .returning('*')
	 .insert({
		email: email,
		name: name,
		joined: new Date()
	}).then(user => {
		res.json(user[0]);
	})
	.catch(err => res.status(400).json('Unable to register'))
})

app.get('/profile/:id', (req, res) =>{
	const { id } = req.params;
	db.select('*').from('users').where('id', id)
		.then(user => {
			if(user.length){
				res.json(user[0]);	
			} else {
				res.status(400).json('Not found')
			}		
		})
	 	.catch(err => res.status(400).json('Error getting user'))		
})

app.put('/image', (req, res) =>{
	const { id } = req.body;
	db('users').where('id', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries  => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('Unable to get entries'));
})

app.listen(3000, () => {
	console.log('app is running on port 3000');
})

/*
API Endpoints
/ --> res = this is working
/signIn --> POST = success/error logging in
/register --> POST = new user
/profile/:userId --> GET = user
/image --> PUT --> user (count)
*/