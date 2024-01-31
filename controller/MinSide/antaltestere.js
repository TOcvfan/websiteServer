const antal = (req, res, knex, dotenv) => {
    dotenv.config()

    knex.select('id', 'email').from('apptester')
        .then(user => {
            if (user.length) {
                res.json(user)
            } else {
                res.status(404).json({ message: 'ingenting her', error: true })
            }
        })
        .catch(err => res.status(400).json({ message: 'error getting list ' + err, error: true }))
}

module.exports = {
    antal
};