const handleProfile = (req, res, knex, jwt, dotenv) => {
	const { id } = req.params;
	const numId = Number(id)
	const { liste, profil } = req.body;
	dotenv.config()
	var user = null;
	if (req.headers && req.headers.authorization) {
		var authorization = req.headers.authorization.split(' ')[1],
			decoded;
		try {
			decoded = jwt.verify(authorization, process.env.SECRET_OR_KEY);
		} catch (e) {
			throw res.status(401).send({ message: 'unauthorized ' + e, error: true });
		}
		if (decoded.id === numId) {
			user = true;
		} else {
			user = false;
		}
	} else {
		return res.status(403).send({ message: 'token mangler', error: true });
	}
	const opdater = (tabel, id, liste) => {
		return knex(tabel)
			.where(id)
			.update(liste)
	}

	if (user) {
		if (liste.rosie) {
			delete liste.rosie
			opdater('bruger_profil', { bruger_id: id }, liste).then(u => {
				if (profil.bella) {
					delete profil.bella
					opdater('bruger', { id: id }, profil).then(p => {
						res.status(200).send({ message: 'ok', error: false })
					})
				} else return res.status(200).send({ message: 'ok', error: false })
			})
		} else if (profil.bella) {
			delete profil.bella
			opdater('bruger', { id: id }, profil).then(p => {
				res.status(200).send({ message: 'ok', error: false })
			})
		}
		else return res.status(403).send({ message: 'unauthorized', error: true });
	}
	else return res.status(403).send({ message: 'unauthorized', error: true });

}
module.exports = {
	handleProfile
}