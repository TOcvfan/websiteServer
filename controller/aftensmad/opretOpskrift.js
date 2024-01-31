const nyOpskrift = (req, res, knex, dotenv, fileName) => {
    dotenv.config();
    const { ingredienser, metode, titel, beskrivelse, ret, ret_beskrivelse } = req.body;
    const maengde = 'ingrediensmaengde';
    const opskrift = 'opskrift';
    const retTabel = 'ret';
    const ingre = 'ingrediens';

    let billedeNavn_ret = 0;
    let lille_ret = "fisse"
    let billedeNavn_opskrift = 0;
    let lille_opskrift = "fisse"

    const { billede_ret, billede_opskrift } = req.files ? req.files : false

    if (billede_ret) {
        lille_ret = billede_ret.mimetype.toLowerCase();
        const billedetype = billede_ret.name.split('.')[1]
        const retNavnNoSpace = ret.replace(/\s/g, '');
        const retNavnO = retNavnNoSpace.replace(/[ø]/g, 'o');
        const retNavnAA = retNavnO.replace(/[å]/g, 'aa');
        const retNavnae = retNavnAA.replace(/[æ]/g, 'ae');
        const img = fileName + retNavnae + '.' + billedetype;
        billedeNavn_ret = img.toLowerCase()
    }
    if (billede_opskrift) {
        lille_opskrift = billede_opskrift.mimetype.toLowerCase();
        const billedetype = billede_opskrift.name.split('.')[1]
        const titelNavnNoSpace = titel.replace(/\s/g, '');
        const titelNavnO = titelNavnNoSpace.replace(/[ø]/g, 'o');
        const titelNavnAA = titelNavnO.replace(/[å]/g, 'aa');
        const titelNavnae = titelNavnAA.replace(/[æ]/g, 'ae');
        const img = fileName + titelNavnae + '.' + billedetype;
        billedeNavn_opskrift = img.toLowerCase()
    }

    const opret = (billede_ret, billede_opskrift) => {
        knex.select('id').from(retTabel).where('navn', ret).then(i => {
            if (i.length) {
                return i[0].id
            } else {
                return knex(retTabel).insert({ navn: ret, billede: billede_ret, beskrivelse: ret_beskrivelse }).then(i => {
                    return i[0]
                })
            }
        }).then(t => {
            knex(opskrift).insert({ titel, metode, beskrivelse, billede: billede_opskrift, ret_id: t }).then(id => {
                const ingrediensListe = ingredienser.map(ingr => {
                    const ingreObj = knex.select('id').from(ingre).where('navn', ingr.navn).then(ingre_id => {
                        if (ingre_id.length) {
                            return ingre_id[0].id
                        } else {
                            return knex(ingre).insert({ navn: ingr.navn }).then(i => {
                                return i[0]
                            })
                        }
                    }).then(ingreId => {
                        delete ingr.navn;
                        ingr.ingrediens_id = ingreId;
                        ingr.opskrift_id = id[0];
                        return ingr
                    })
                    return ingreObj
                })
                return Promise.all(ingrediensListe)
            }).then(ingrediensListe => {
                knex.insert(ingrediensListe).into(maengde).then(nyting => {
                    res.json(nyting)
                })
            })
        })
    }

    const billedeRet = () => {
        if (lille_ret == "image/png" || lille_ret == "image/jpeg" || lille_ret == "image/jpg" || lille_ret == "image/bmp") {
            billede_ret.mv('./public/aftensmad/' + billedeNavn_ret);
            opret(billedeNavn_ret, billedeNavn_opskrift)
        } else if (lille_ret == "fisse") {
            opret(billedeNavn_ret, billedeNavn_opskrift)
        } else {
            res.send({
                error: true,
                message: lille_ret
            });
        }
    }

    if (lille_opskrift == "image/png" || lille_opskrift == "image/jpeg" || lille_opskrift == "image/jpg" || lille_opskrift == "image/bmp") {

        billede_opskrift.mv('./public/aftensmad/' + billedeNavn_opskrift);
        billedeRet()
    } else if (lille_opskrift == "fisse") {
        billedeRet()
    } else {
        res.send({
            error: true,
            message: lille_opskrift
        });
    }

}

module.exports = {
    nyOpskrift
};