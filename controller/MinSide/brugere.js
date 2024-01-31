const handleUsers = (req, res, knex, jwt, dotenv) => {
	dotenv.config()
	//console.log('test')

	var chef = null;
	if (req.headers && req.headers.authorization) {
		var authorization = req.headers.authorization.split(' ')[1],
			decoded;
		try {
			decoded = jwt.verify(authorization, process.env.SECRET_OR_KEY);
		} catch (e) {
			return res.status(401).send({ message: 'unauthorized', error: true });
		}
		if (decoded.role === 'ADMIN') {
			chef = true;
		} else {
			chef = false;
		}
	} else {
		return res.status(403).send({ message: 'token mangler', error: true });
	}

	if (!chef) { return res.status(403).send({ message: 'unauthorized', error: true }); }

	knex.select('id', 'brugernavn', 'role').from('bruger')
		.then(user => {
			if (user.length) {
				res.json(user)
			} else {
				res.status(404).json({ message: 'ingenting her', error: true })
			}
		})
		.catch(err => res.status(400).json({ message: 'error getting list ' + err, error: true }))
}

module.exports = {
	handleUsers
};