const handleStjerner = (req, res, knexDb) => {
    const { vogn, mad, morgenmad, faellesspisning, convoytur, visdinbil, marked, baal, auktion, ventil, pris } = req.body;

    const table = 'stjerner'

    if (!vogn || !morgenmad || !faellesspisning) {
        return res.status(401).send('fields not sent');
    }
    knexDb.insert({
        vogn,
        mad,
        ventil,
        pris,
        morgenmad,
        faellesspisning,
        convoytur,
        visdinbil,
        marked,
        baal,
        auktion
    })
        .into(table)
        .then(by => {
            res.json('success');
        })

        .catch(err => res.status(400).json('noget gik galt contakt Christian ' + err))
}

module.exports = {
    handleStjerner
};