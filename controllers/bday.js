const handleBdayRegistraition = (req, res, db) => {
	const { email, name, numberAdults, numberKids, sleepOver} = req.body;
	if (!email || !name || !numberAdults || !numberKids || !sleepOver) {
		return res.status(400).json('incorrect form submission');
	}
	
	db.insert({
			name: name,
			email: email,
			numberAdults: numberAdults,
			numberKids: numberKids,
			sleepOver: sleepOver
		})
		.into('bday')
		.returning('*')
		.then(user => {
			res.json('success');
			})
		.then(db.commit)
		.catch(db.rollback)

	.catch(err => res.status(400).json('unable to register ' + err))
}

module.exports = {
	handleBdayRegistraition: handleBdayRegistraition
};