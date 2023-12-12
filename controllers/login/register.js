const handleRegisterShop = (req, res, db, bcrypt) => {
	const { email, fname, lname, password, address1, address2, zip, city, phone, role } = req.body;
	if (!email || !fname || !lname || !password || !address1 || !zip || !city || !phone || !role) {
		return res.status(400).json('incorrect form submission');
	}
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('loginshop')
		.returning('email')
		.then(loginEmail => {
			return trx('usersshop')
			.returning('*')
			.insert({
				email: email,
                fname: fname,
                lname: lname,
				address1: address1,
				address2: address2,
				zip: zip,
                city: city,
                phone: phone,
                role: role
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
	handleRegisterShop: handleRegisterShop
};
