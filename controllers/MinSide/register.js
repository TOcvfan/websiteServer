const handleRegister = async (req, res, User, jwt, dotenv, knexDb) => {
	dotenv.config();
	const { email, brugernavn, fornavn, mellemnavn, efternavn, password, forhold, foedselsdag, sex, sprog, land, dyr } = req.body;
	let payload = {}
	let userid;
	const role = forhold.toUpperCase()
	/*if (!email || !navn || !password || !birthdate || !language || !gender) {
		return res.status(401).send('no fields');
	}*/
	const brugersdyr = 'dyr'
	const svarfunk = (svarvaerdier) => { res.status(200).json(svarvaerdier) }
	//let dyreliste = []

	/*const haanterdyr = (id) => {

		const idvaerdi = (tal) => { return { bruger_id: id, dyr_id: tal } }
		for (const key in dyr) {

			if (dyr[key]) {
				switch (key) {
					case 'kat': dyreliste.push(idvaerdi(1));
						break;
					case 'hund': dyreliste.push(idvaerdi(2));
						break;
					case 'fisk': dyreliste.push(idvaerdi(3));
						break;
					case 'fugl': dyreliste.push(idvaerdi(4));
						break;
					case 'edderkop': dyreliste.push(idvaerdi(5));
						break;
					case 'skildpadde': dyreliste.push(idvaerdi(6));
						break;
					case 'slange': dyreliste.push(idvaerdi(7));
						break;
					default: dyreliste = false
						break;
				}
			}
		}

		if (dyreliste) {
			knexDb(brugersdyr).insert(dyreliste).then(() => svarfunk(payload))
		} else svarfunk(payload)
	}*/

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
			//const role = role
			//console.log(userid)
			const load = { role, userid }
			const token = jwt.sign(load, process.env.SECRET_OR_KEY);
			payload = { token: token, id: newUser.id, auth: true, role };
			//console.log(JSON.stringify(payload))
			//res.status(200).json(payload);
		}).then(() => {
			//console.log(userid)
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
					dyr['bruger_id'] = id
					knexDb(brugersdyr).insert(dyr).then(() => svarfunk(payload))
				})
		});
	}

	const m = 'email';
	const b = 'brugernavn'
	const where = (first, second) => knexDb(tabel).where(first, '=', second);
	const response = (reply) => res.status(409).send(reply);

	where(m, email).then((mail) => {
		if (mail.length != 0) {
			return response('mail')
		} else {
			where(b, brugernavn).then((bruger) => {
				if (bruger.length != 0) {
					return response('bruger')
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
			})
		}
	});
}

module.exports = {
	handleRegister
};
