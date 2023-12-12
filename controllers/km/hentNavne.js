const handleNavne = (req, res, knexDb) => {
	
	knexDb.select('username', 'email').from('alarm_login')
		.then(data => {
			if (data.length) {
				res.json(data)
			} else {
				res.status(400).json('Not found')
			}
		})
		.catch(err => res.status(400).json('Error getting list ' + err));
}

module.exports = {
	handleNavne
};