const handleSignin = (req, res, knexDb, bcrypt, jwt, dotenv) => {
	dotenv.config();
	const { password, brugernavn } = req.body;
	let payload = {};
	let dyrArray = []
	let id;
	const tabel = 'bruger';
	const profil = 'bruger_profil';
	const dyr = 'dyr';
	const loadUser = () => {
		return knexDb(tabel).leftOuterJoin(profil, `${tabel}.id`, `${profil}.bruger_id`)
			.select(`${tabel}.id`, `${profil}.fornavn`, `${profil}.mellemnavn`, `${profil}.efternavn`, `${tabel}.email`, `${profil}.forhold`, `${tabel}.brugernavn`, `${profil}.sidstOnline`, `${profil}.sprog`, `${profil}.foedselsdag`, `${profil}.land`, `${profil}.sex`, `${profil}.billede`, `${tabel}.role`)
			.where(`${tabel}.email`, brugernavn)
			.orWhere(`${tabel}.brugernavn`, brugernavn)
			.then(user => {
				id = user[0].id;
				const fornavn = user[0].fornavn;
				const efternavn = user[0].efternavn;
				const mellemnavn = user[0].mellemnavn;
				const brugernavn = user[0].brugernavn;
				const forhold = user[0].forhold;
				const email = user[0].email;
				const sidstOnline = user[0].sidstOnline;
				const sprog = user[0].sprog;
				const foedselsdag = user[0].foedselsdag;
				const land = user[0].land;
				const sex = user[0].sex;
				const billede = user[0].billede;
				const role = user[0].role;
				const token = jwt.sign({ role: role, id: id }, process.env.SECRET_OR_KEY);
				payload = { role, auth: true, token, billede, id, brugernavn, fornavn, mellemnavn, efternavn, forhold, email, foedselsdag, sex, sidstOnline, sprog, land, dyr: dyrArray };
			}).then(() => {
				knexDb(dyr)
					.select('kat', 'hund', 'fisk', 'fugl', 'edderkop', 'skildpadde', 'slange', 'ingen').where(`bruger_id`, id)
					.then(dyr => {
						const dyrObj = dyr[0];
						for (const key in dyrObj) {
							if (dyrObj[key] == 0) {
								dyrObj[key] = false
							} else if (dyrObj[key] == 1) {
								dyrObj[key] = true
							}
						}
						payload.dyr = dyrObj;
					})
			}).then(() => {
				knexDb(profil).where('id', '=', payload.id).update({ sidstOnline: new Date() })
					.then(() => {
						res.status(200).send(payload);
					}).catch(err => res.status(400).json('der skete en fejl ' + err))
			})
			.catch(err => res.status(400).json('unable to get user ' + err))
	}

	const sammenlignPassword = (pass) => {
		bcrypt.compareSync(password, pass) === true ?
			loadUser() : res.status(409).send({ name: 'password', errorMessage: 'Forkert kode', error: true })
	}

	knexDb.select('brugernavn', 'email', 'userpassword').from(tabel)
		.where('email', brugernavn)
		.orWhere('brugernavn', brugernavn)
		.then(data => {
			data[0] === undefined ? res.status(409).send({ name: 'bruger', errorMessage: brugernavn, error: true }) : sammenlignPassword(data[0].userpassword)
		})
		.catch(err => res.status(400).json(err));
}


module.exports = {
	handleSignin
};