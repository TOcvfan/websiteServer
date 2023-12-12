const handleHentStjerner = (req, res, knexDb) => {

    const table = 'stjerner'

    knexDb(table).select('*')
        .then(by => {
            if (by.length) {
                res.json(by)
            } else {
                res.status(400).json('Not found')
            }
        })
        .catch(err => res.status(400).json(err + ' error getting list'))
}

module.exports = {
    handleHentStjerner
};