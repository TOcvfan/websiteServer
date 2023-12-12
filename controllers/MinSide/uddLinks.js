const uddlinks = (req, res, knex) => {

    knex.select('*').from('link').where('emne', 'skole').orderBy('navn')
        .then(user => {
            if (user.length) {
                //console.log(user)
                res.json(user)
            } else {
                res.status(404).json('Not found')
            }
        })
        .catch(err => res.status(400).json('error getting links'))
}

module.exports = {
    uddlinks
};