const uddlinks = (req, res, knex) => {
    const response = (reply, err, status) => res.status(status).send({ message: reply, error: err });

    knex.select('id', 'navn', 'link', 'beskrivelse').from('link').where('emne', 1).orderBy('navn')
        .then(user => {
            if (user.length) {
                //console.log(user)
                res.json(user)
            } else {
                response('Not found', true, 404)
            }
        })
        .catch(err => response('error getting links ' + err, true, 400))
}

module.exports = {
    uddlinks
};