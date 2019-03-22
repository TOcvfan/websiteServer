const handleRegisterFood = (req, res, db, bcrypt) => {
	const { email, fName, lName, password, address, zip, city } = req.body;
	if (!email || !fName || !lName || !password || !address || !zip || !city) {
		return res.status(400).json('incorrect form submission');
	}
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('loginfood')
		.returning('email')
		.then(loginEmail => {
			console.log(email)
			return trx('usersfood')
			.returning('*')
			.insert({
				email: email,
				fName: fName,
				lName: lName,
				address: address,
				zip: zip,
				city: city
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
	handleRegisterFood: handleRegisterFood
};
