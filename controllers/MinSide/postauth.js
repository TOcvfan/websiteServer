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
            return res.status(401).send('unauthorized');
        }
        const rolle = decoded.role;
        if (rolle === 'SKOLE' || rolle === 'ADMIN') {
            user = true;
        } else {
            user = false;
        }
    } else {
        return res.status(403).send('token mangler');
    }
    console.log(user)
    switch (user) {
        case true:
            return knex(tabel)
                .insert(liste).then(t => {
                    res.status(200).send('ok ' + t)
                });
        case false:
            return res.status(403).send('ingen adgang');
    }
}

module.exports = {
    nyAuthPost
};