const handleRegister = (req, res, db, bcrypt) => {
	const { email, name, password, age, /*contact,*/ gender } = req.body;
	if (!email || !name || !password || !age /*|| !contact*/ || !gender) {
		return res.status(400).json('incorrect form submission');
	}
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({
				email: email,
				name: name,
				joined: new Date(),
				age: age,
				//contact: contact,
				gender: gender
			})
			.then(user => {
			res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	
	.catch(err => res.status(400).json('unable to register ' + err))

}

module.exports = {
	handleRegister: handleRegister
};
