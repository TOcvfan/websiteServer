const handleOffersGet = (req, res, db) => {
	const { offerNumber } = req.params;
	db.select('*').from('offers').where({offerNumber})
		.then(offer => {
			if (offer.length) {
				res.json(offer[0])
			} else {
				res.status(400).json('Not found')
			}
		})
		.catch(err => res.status(400).json('error getting offer'))
}

module.exports = {
	handleOffersGet
};