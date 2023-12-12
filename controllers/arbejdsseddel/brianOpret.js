const handleBrianOpret = (req, res, knexDb, brianUser, dotenv) => {
	dotenv.config();
	const { navn, password, role } = req.body;
	if (!navn || !password || !role) {
		return res.status(400).json('incorrect form submission');
	}

	const table = 'brianbruger'

	const newUser = async () => {
		const user = new brianUser({
			navn: navn,
			password: password,
			role: role
		});
		user.save().then((newUser) => {
			const userid = { id: newUser.id };
			const role = { role: newUser.role }
			const load = { role, userid }
			const token = jwt.sign(load, process.env.SECRET_OR_KEY);
			const payload = { token: token, role: newUser.role, name: newUser.name, id: newUser.id };
			console.log(JSON.stringify(payload))
			res.status(200).json(payload);
		})

			.catch(err => res.status(400).json('unable to register ' + err))

	}

	const m = 'navn';
	const jsont = (t) => JSON.stringify(t[0].navn);
	const where = (first, second) => knexDb(table).where(first, '=', second);
	const response = (reply, user, more) => res.status(409).send(reply + user + more);

	where(m, navn).then((bruger) => {
		if (bruger.length != 0) {
			return response('bruger ', jsont(bruger), ' existere allerede')
		} else {
			try {
				newUser()
			} catch (e) {
				if (e.errno == 1062) {
					return res.status(409).json('duplicate entry');
				} else {
					return res.send('an error accurred');
				}
			}
		}
	});
}


module.exports = {
	handleBrianOpret
};
