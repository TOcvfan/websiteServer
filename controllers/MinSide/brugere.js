const handleUsers = (req, res, knex, jwt, dotenv) => {
	dotenv.config()
	console.log('test')
	var chef = null;
	if (req.headers && req.headers.authorization) {
		var authorization = req.headers.authorization.split(' ')[1],
			decoded;
		try {
			decoded = jwt.verify(authorization, process.env.SECRET_OR_KEY);
		} catch (e) {
			return res.status(401).send('unauthorized');
		}
		if (decoded.role === 'ADMIN') {
			chef = true;
		} else {
			chef = false;
		}
	} else {
		return res.status(403).send('token mangler');
	}

	if (!chef) { return res.status(403).send('nix'); }

	knex.select('brugernavn').from('bruger')
		.then(user => {
			if (user.length) {
				res.json(user)
			} else {
				res.status(400).json('Not found')
			}
		})
		.catch(err => res.status(400).json('error getting users'))
}

module.exports = {
	handleUsers
};