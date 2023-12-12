const handleBrianLogin = (req, res, knexDb, bcrypt, jwt, dotenv) => {
	dotenv.config();
	const { navn, password } = req.body;
	if (!navn || !password) {
		return res.status(400).json('incorrect form submission');
	}
	knexDb.select('navn', 'password_digest').from('brianbruger')
		.where('navn', '=', navn)
		.then(data => {
      const isValid = bcrypt.compareSync(password, data[0].password_digest);
			if (isValid) {
				return knexDb.select('id', 'navn', 'role').from('brianbruger')
					.where('navn', '=', navn)
					.then(user => {
			const navn = user[0].navn;
            const id = user[0].id;
            const role = user[0].role;
            const token = jwt.sign({ role: user[0].role }, process.env.SECRET_OR_KEY);
            const payload = {role: role, auth: true, token: token, id: id, navn: navn };
						  res.status(200).send(payload);
					})
					.catch(err => res.status(400).json('unable to get user ' + err))
			} else {
				res.status(400).json('wrong credentials'),
				res.status(401).send('slut '+{ auth: false, token: null })
			}
		})
		.catch(err => res.status(400).json('wrong credentials ' + err));
}


module.exports = {
	handleBrianLogin
};
