const handleBruger = (req, res, knexDb) => {
	const { id } = req.params;
	if (!id) {
		return res.status(400).json('incorrect form submission');
	}
	knexDb.select('id').from('alarm_login')
		.where('id', '=', id)
		.then(data => {
				return knexDb.select('email', 'alarmer', 'middlename', 'initialer', 'telefon', 'skadeservice', 'role').from('alarm_login')
					.where('id', '=', id)
					.then(user => {
            const email = user[0].email;
            const alarmer = user[0].alarmer;
            const mellemnavn = user[0].middlename;
			const initialer = user[0].initialer;
			const telefon = user[0].telefon;
			const skadeservice = user[0].skadeservice;
			const role = user[0].role;
            
            const payload = {
                alarmer: alarmer,
                role: role, 
                auth: true, 
                email: email,
                mellemnavn: mellemnavn,
				initialer: initialer,
				telefon: telefon,
				skadeservice: skadeservice
            };
						  res.status(200).send(payload);
					})
					.catch(err => res.status(400).json('unable to get user ' + err))
			
		})
		.catch(err => res.status(400).json('wrong credentials ' + err));
}

module.exports = {
	handleBruger
};