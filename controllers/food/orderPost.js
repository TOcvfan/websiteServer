const handleOrdersPost = (req, res, db) => {
	const { customerId, orderStatus, productId, quantity, price} = req.body;
	if (!customerId || !orderStatus || !productId || !quantity || !price) {
		return res.status(400).json('incorrect form submission');
	}
	
	db.transaction(trx =>{
		trx.insert({
			customerId: customerId,
			orderStatus: orderStatus,
			orderDate: new Date()
			})
		.into('orders')
		.returning('orderId').map(function(row){
			return row.orderId;
		}).then(function(orders) {console.log(orders);})
		.then(orderId => {
			return trx('orderitem')
			.returning('*')
			.insert({
				
				orderId: orderId,
		
				productId: [productId],
				quantity: [quantity],
				price: [price]
				})
			.then(order => {
			res.json('success');
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
			

	.catch(err => res.status(400).json('unable to submit order ' + err))
}

module.exports = {
	handleOrdersPost: handleOrdersPost
};