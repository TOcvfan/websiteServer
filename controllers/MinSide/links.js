const links = (req, res, knex) => {
    const emner = 'emner'
    const tabel = 'link'
    knex.select('id', 'navn').from(emner).orderBy('navn', 'desc')
        .then(user => {
            if (user.length) {
                knex.select('navn', 'link', 'beskrivelse', 'emne').from(tabel).orderBy('navn').then(info => {
                    let liste = [];
                    let arrayliste = []
                    user.map(t => {
                        info.map(inf => {
                            if (inf.emne == t.id) {
                                liste.push(inf)
                                delete inf.emne
                            }
                        })
                        t['linkliste'] = liste
                        arrayliste.push(t)
                        liste = []
                    })
                    res.status(200).send(arrayliste)
                })
            } else {
                res.status(404).json('Not found')
            }
        })
        .catch(err => res.status(400).json('error getting links'))
}

module.exports = {
    links
};