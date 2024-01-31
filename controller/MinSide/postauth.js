const nyAuthPost = (req, res, knex, jwt, dotenv, tabel) => {
    const { liste } = req.body;
    dotenv.config()
    var user = null;
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, process.env.SECRET_OR_KEY);
        } catch (e) {
            throw res.status(401).send({ message: 'unauthorized ' + e, error: true });
        }
        const rolle = decoded.role;
        if (rolle === 'SKOLE' || rolle === 'ADMIN') {
            user = true;
        } else {
            user = false;
        }
    } else {
        return res.status(403).send({ message: 'token mangler', error: true });
    }

    switch (user) {
        case true:
            return knex(tabel)
                .insert(liste).then(t => {
                    return res.status(200).send({ message: 'ok', error: false })
                });
        case false:
            return res.status(403).send({ message: 'unauthorized', error: true });
    }
}

module.exports = {
    nyAuthPost
};