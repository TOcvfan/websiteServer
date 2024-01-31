const redigering = (req, res, knex, jwt, dotenv, redigerTabel) => {
    const { id } = req.params;
    const numId = Number(id)
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
        if (decoded.id === numId) {
            user = true;
        } else {
            user = false;
        }
    } else {
        return res.status(403).send({ message: 'token mangler', error: true });
    }
    const opdater = (tabel, id, liste) => {
        return knex(tabel)
            .where(id)
            .update(liste)
    }

    if (user) {
        opdater(redigerTabel, { bruger_id: id }, liste).then(u => {
            return res.status(200).send({ message: 'ok', error: false })
        }).catch(e => {
            throw res.status(500).send({ message: e, error: true })
        })

    }
    else return res.status(403).send({ message: 'unauthorized', error: true });

}
module.exports = {
    redigering
}