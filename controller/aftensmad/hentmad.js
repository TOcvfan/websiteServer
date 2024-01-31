const opskriftNavne = (res, knex) => {
    const tabel = 'ret'
    knex.select('*').from(tabel)
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
    opskriftNavne
};