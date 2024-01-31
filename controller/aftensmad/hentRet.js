const ret = (res, req, knex) => {
    const { id } = req.params;
    const tabel = 'ret'
    knex.select('*').from(tabel).where('id', id)
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.json({ message: 'ingenting her', error: true })
            }
        })
        .catch(err => res.status(400).json({ message: 'error getting list ' + err, error: true }))
}

module.exports = {
    ret
};