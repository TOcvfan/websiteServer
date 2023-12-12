const nyPost = (req, res, knex, dotenv, tabel) => {
    dotenv.config()
    const { liste } = req.body;

    knex(tabel)
        .insert(liste).then(t => {
            res.status(200).send('ok ' + t)
        }).catch((error) => {
            res.status(404).send('fejl ' + error)
        });

}

module.exports = {
    nyPost
};