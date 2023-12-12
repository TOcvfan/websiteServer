const opslag = (req, res, knex) => {
    const tabel = 'gaestebog'
    knex.select('*').from(tabel).where('visden', true).orderBy('dato', 'desc')
        .then(user => {
            if (user.length) {
                res.json(user)
            } else {
                res.status(404).json('Not found')
            }
        })
        .catch(err => res.status(400).json('error getting list'))
}

module.exports = {
    opslag
};