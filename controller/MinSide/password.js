const nytPassword = async (req, res, knexDb, bcrypt, dotenv) => {
    dotenv.config();
    const { password, email, newPass } = req.body;
    const tabel = 'bruger';

    const hashPass = async (value) => {
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(value, 12, function (err, hash) {
                if (err) reject(err)
                resolve(hash)
            });
        })
        return hashedPassword;
    }

    const kodeord = (kode) => {
        return knexDb(tabel).where('email', email).update('userpassword', kode).then((g) => {
            res.status(201).send({ message: 'done', error: false })
        })
    }
    const sammenlignPassword = (pass) => {
        bcrypt.compareSync(password, pass) === true ?
            hashPass(newPass).then(t => {
                kodeord(t)
            }) : res.status(409).send({ message: 'Forkert kode', error: true })
    }

    knexDb.select('userpassword').from(tabel)
        .where('email', email)
        .then(data => {
            sammenlignPassword(data[0].userpassword)
        })
        .catch(err => res.status(400).json({ message: err, error: true }));
}

module.exports = {
    nytPassword
};