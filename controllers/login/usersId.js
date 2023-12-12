const handleUserId = (req, res, db) => {
	const { id } = req.params;
	db.select('*').from('usersshop').where({id})
		.then(user => {
			if (user.length) {
				res.json(user[0])
			} else {
				res.status(400).json('Not found')
			}
		})
		.catch(err => res.status(400).json(err + ' error getting user'))
}

module.exports = {
	handleUserId
};