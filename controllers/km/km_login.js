const handleKmLogin = (req, res, knexDb, bcrypt, jwt, dotenv) => {
	dotenv.config();
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json('incorrect form submission');
	}
	knexDb.select('email', 'password_digest').from('alarm_login')
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].password_digest);
			if (isValid) {
				return knexDb.select('id', 'email', 'firstname', 'middlename', 'lastname', 'alarmer', 'vagt_id', 'initialer', 'telefon', 'skadeservice', 'role').from('alarm_login')
					.where('email', '=', email)
					.then(user => {
						const fornavn = user[0].firstname;
						const mellemnavn = user[0].middlename;
						const efternavn = user[0].lastname;
						const vagt_id = user[0].vagt_id;
						const initialer = user[0].initialer;
						const telefon = user[0].telefon;
						const skadeservice = user[0].skadeservice;
						const id = user[0].id;
						const role = user[0].role;
						const alarmer = user[0].alarmer;
						const token = jwt.sign({ role: role, id: id }, process.env.SECRET_OR_KEY);
						const payload = {
							role: role,
							auth: true,
							token: token,
							email,
							id: id,
							alarmer: alarmer,
							fornavn: fornavn,
							mellemnavn: mellemnavn,
							efternavn: efternavn,
							vagt_id: vagt_id,
							initialer: initialer,
							telefon: telefon,
							skadeservice: skadeservice
						};
						res.status(200).send(payload);
					})
					.catch(err => res.status(400).json('unable to get user ' + err))
			} else {
				res.status(400).json('wrong credentials'),
					res.status(401).send('slut ' + { auth: false, token: null })
			}
		})
		.catch(err => res.status(400).json('wrong credentials ' + err));
}

module.exports = {
	handleKmLogin
};