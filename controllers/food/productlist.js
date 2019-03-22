const handleProductGet = (req, res, db) => {
	db.select('*').from('products').orderBy('number')
		.then(product => {
			if (product.length) {
				res.json(product)
			} else {
				res.status(400).json('Not found')
			}
		})
		.catch(err => res.status(400).json('error getting product'))
}

module.exports = {
	handleProductGet
};