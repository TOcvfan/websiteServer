const handleOfferGet = (req, res, db) => {
	db.select('productName').from('offers')
		.then(offer => {
			if (offer.length) {
				res.json(offer)
			} else {
				res.status(400).json('Not found')
			}
		})
		.catch(err => res.status(400).json('error getting offer'))
}

module.exports = {
	handleOfferGet
};