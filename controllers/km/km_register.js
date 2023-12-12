const handleKmRegister = async (req, res, KmUser, jwt, dotenv) => {
	dotenv.config();
	const { email, firstname, middlename, lastname, password, initialer, vagt_id, skadeservice, alarmer, telefon, role } = req.body;
	if (!firstname || !initialer || !lastname || !password || !email || !telefon || !role) {
		return res.status(401).send('no fields');
	}
	try {
		const user = new KmUser({
			firstname: firstname,
			middlename: middlename,
			lastname: lastname,
			email: email,
			password: password,
			initialer: initialer,
			vagt_id: vagt_id,
			skadeservice: skadeservice,
			alarmer: alarmer,
			telefon: telefon,
			role: role
		});
		return await user.save().then((newUser) => {
			const role = { role: newUser.role }
			const userid = { id: newUser.id };
			const token = jwt.sign(role, userid, process.env.SECRET_OR_KEY);
			const payload = { token: token, role, name: newUser.name, userid };
			res.status(200).json(payload);
		});
	} catch (e) {
		if (e.errno == 1062) {
			return res.status(409).json('duplicate entry');
		} else {
			return res.send(e + 'an error accurred');
		}
	}
}
module.exports = {
	handleKmRegister
};