const handleKmListe = (req, res, knexDb) => {
	const { id } = req.params;
	knexDb.select('*').from('kmliste').where('user_id', id)
		.then(car => {
			if (car.length) {
				res.json(car)
			} else {
				res.status(400).json('Not found')
			}
		})
		.catch(err => res.status(400).json(err + ' error getting list'))
}

module.exports = {
	handleKmListe
};