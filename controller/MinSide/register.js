const handleRegister = async (req, res, User, jwt, dotenv, knexDb) => {
	dotenv.config();
	const { email, brugernavn, fornavn, mellemnavn, efternavn, password, forhold, foedselsdag, sex, sprog, land, dyr } = req.body;
	let payload = {}
	let userid;
	const role = forhold.toUpperCase()

	const brugersdyr = 'dyr'
	const svarfunk = (svarvaerdier) => { res.status(200).json(svarvaerdier) }
	const response = (reply, err, status) => res.status(status).send({ message: reply, error: err });

	const profil = 'bruger_profil';
	const tabel = 'bruger'
	const newUser = async () => {
		const user = new User({
			brugernavn,
			password,
			email,
			role
		});
		return await user.save().then((newUser) => {
			userid = { id: newUser.id };
			const load = { role, userid }
			const token = jwt.sign(load, process.env.SECRET_OR_KEY);
			payload = { token: token, id: newUser.id, auth: true, role, error: false };
		}).then(() => {
			const bruger_id = userid.id
			const bruger = {
				bruger_id: bruger_id,
				fornavn,
				mellemnavn,
				efternavn,
				oprettetDen: new Date(),
				sidstOnline: new Date(),
				forhold,
				foedselsdag,
				land,
				sex,
				sprog
			}
			knexDb.insert(bruger).into(profil)
				.then(() => {
					dyr['bruger_id'] = bruger_id
					console.log(payload)
					knexDb(brugersdyr).insert(dyr).then(() => svarfunk(payload))
				})
		});
	}

	const m = 'email';
	const b = 'brugernavn'
	const where = (first, second) => knexDb(tabel).where(first, '=', second);

	where(m, email).then((mail) => {
		if (mail.length != 0) {
			return response('mail', true, 409)
		} else {
			where(b, brugernavn).then((bruger) => {
				if (bruger.length != 0) {
					return response('bruger', true, 409)
				} else {
					try {
						newUser()
					} catch (e) {
						if (e.errno == 1062) {
							return response('duplicate entry', true, 409);
						} else {
							return response('an error accurred', true, 400);
						}
					}
				}
			})
		}
	});
}

module.exports = {
	handleRegister
};
