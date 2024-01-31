const nyPost = (req, res, knex, dotenv, tabel) => {
    dotenv.config()
    const { liste } = req.body;

    knex(tabel)
        .insert(liste).then(t => {
            res.status(200).send({ message: 'ok ' + t, error: false })
        }).catch((error) => {
            res.status(404).send({ message: error, error: true })
        });

}

module.exports = {
    nyPost
};