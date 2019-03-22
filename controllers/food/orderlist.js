const handleOrdersGet = (req, res, db) => {
	const { orderNumber, customerId } = req.params;
	db.select('*').from('orders').where({orderNumber}, {customerId})
		.then(order => {
			if (order.length) {
				res.json(order)
			} else {
				res.status(400).json('Not found')
			}
		})
		.catch(err => res.status(400).json('error getting order'))
}

module.exports = {
	handleOrdersGet
};