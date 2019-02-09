const Clarifai = require('clarifai');

const app = new Clarifai.App({
	apiKey: '9d1098f76cff47f38a45007d9837a080'
});

const handleApiCall = (req, res) =>{
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	 db('users').where('id', '=', id)
    .increment('entries', 1)
    .then(()=> 
      db('users').where('id', '=', id).then(user => res.json(user[0].entries))
    )
	.catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleImage,
	handleApiCall
};