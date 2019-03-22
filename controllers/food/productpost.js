const handleProductPost = (req, res, db) => {
	const { productName, productPrice, description, category, number} = req.body;
	if (!productName || !productPrice || !description || !category || !number) {
		return res.status(400).json('incorrect form submission');
	}
	
	db.insert({
			productName: productName,
			productPrice: productPrice,
			description: description,
			category: category,
			number: number
		})
		.into('products')
		.returning('*')
		.then(user => {
			res.json('success');
			})
		.then(db.commit)
		.catch(db.rollback)

	.catch(err => res.status(400).json('unable to submit product ' + err))
}

module.exports = {
	handleProductPost: handleProductPost
};