const handleOfferDel = (req, res, db) => {
	const { offerNumber } = req.params;
	db('offers').where({offerNumber}, offerNumber).del()
		.then(offer => {
			if (offer) {
				res.json('success')
			} else {
				res.status(400).json('Not found')
			}
		})
		.catch(err => res.status(400).json('error deleteing offer'))
}

module.exports = {
	handleOfferDel
};