const handleOfferPost = (req, res, db) => {
	const { productName, productPrice, description} = req.body;
	if (!productName || !productPrice || !description) {
		return res.status(400).json('incorrect form submission');
	}
	
	db.insert({
			productName: productName,
			productPrice: productPrice,
			description: description
		})
		.into('offers')
		.returning('*')
		.then(user => {
			res.json('success');
			})
		.then(db.commit)
		.catch(db.rollback)

	.catch(err => res.status(400).json('unable to submit offer ' + err))
}

module.exports = {
	handleOfferPost: handleOfferPost
};