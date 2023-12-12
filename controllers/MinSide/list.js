const handleGuests = (req, res, db) => {
	db.select('*').from('bday')
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
	handleGuests: handleGuests
};