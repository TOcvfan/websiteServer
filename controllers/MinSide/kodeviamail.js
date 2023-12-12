const nytPassword = async (req, res, knexDb, bcrypt, dotenv, jwt) => {
    dotenv.config();
    const { id } = req.params;
    const { email, newPass } = req.body;
    const tabel = 'bruger';
    var user = null;
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, process.env.SECRET_OR_KEY);
            console.log(decoded)
        } catch (e) {
            return res.status(401).send('unauthorized ' + e);
        }
        const decoded_id = decoded.id;
        if (decoded_id === id) {
            user = true;
        } else {
            user = false;
        }
    } else {
        return res.status(403).send('token mangler');
    }

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
            res.status(201).send({ name: 'password', message: 'done', error: false })
        })
    }
    const sammenlignPassword = () => {
        hashPass(newPass).then(t => {
            kodeord(t)
        })
    }

    knexDb.select('userpassword').from(tabel)
        .where('email', email)
        .then(data => {
            data[0] === undefined ? res.status(409).send({ name: 'bruger', errorMessage: brugernavn, error: true }) : sammenlignPassword()
        })
        .catch(err => res.status(400).json(err));
}


module.exports = {
    nytPassword
};