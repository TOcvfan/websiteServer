const opskrift = (res, req, knex) => {
    const { id } = req.params;
    const metode = 'opskrift';
    const ingrediens = 'ingrediens';
    const maengde = 'ingrediensmaengde';

    knex.select('*').from(metode).where('ret_id', id)
        .then(opskrift => {
            if (opskrift.length) {
                const promises = opskrift.map(o => {
                    return knex.select(`${maengde}.maengde`, `${maengde}.enhed`, `${ingrediens}.navn`, `${maengde}.evt`)
                        .from(maengde)
                        .where(`${maengde}.opskrift_id`, o.id)
                        .leftJoin(ingrediens, `${maengde}.ingrediens_id`, `${ingrediens}.id`)
                        .then(ingre => {
                            o.ingredienser = ingre;
                            return o;
                        });
                });
                return Promise.all(promises);
            } else {
                return { message: 'ingenting her', error: true }
            }
        }).then(opskrifter => {
            res.json(opskrifter);
        })
        .catch(err => res.status(404).json({ message: err, error: true }))
}

module.exports = {
    opskrift
};