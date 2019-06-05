const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '9aeb04611e414652a67e4f9cdae1fbd2'
});
const handleApiCall = (req, res) => {
	app.models
 .predict('e466caa0619f444ab97497640cefc4dc',req.body.input)
 .then(data => {
 	res.json(data);
 })
 .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db) =>{
	const { id } = req.body;
	db('users').where('id', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries  => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('Unable to get entries'));
}

module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall
}