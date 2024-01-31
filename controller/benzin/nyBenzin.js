const handleBenzin = (req, res, knexDb) => {
    const { liste } = req.body;

    const table = 'oktan95'

    if (!liste) {
        return res.status(401).send('fields not sent');
    }
    knexDb.insert(liste)
        .into(table)
        .then(by => {
            res.json('success');
        })

        .catch(err => res.status(400).json('noget gik galt contakt Christian ' + err))
}

module.exports = {
    handleBenzin
};