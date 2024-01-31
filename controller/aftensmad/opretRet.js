const nyRet = (req, res, knex, dotenv, fileName) => {
    dotenv.config();
    const { ret, ret_beskrivelse } = req.body;
    const retTabel = 'ret';
    let billedeNavn = 0;
    let lille = "fisse"

    const { billede } = req.files ? req.files : false

    if (billede) {
        lille = billede.mimetype.toLowerCase();
        const billedetype = billede.name.split('.')[1]
        const retNavnNoSpace = ret.replace(/\s/g, '');
        const retNavnO = retNavnNoSpace.replace(/[ø]/g, 'o');
        const retNavnAA = retNavnO.replace(/[å]/g, 'aa');
        const retNavnae = retNavnAA.replace(/[æ]/g, 'ae');
        const img = fileName + retNavnae + '.' + billedetype;
        billedeNavn = img.toLowerCase()
    }
    const opret = (billede) => {
        knex.select('id').from(retTabel).where('navn', ret).then(i => {
            if (i.length) {
                return res.status(409).send({ message: 'findes', error: true });
            } else {
                return knex(retTabel).insert({ navn: ret, billede, beskrivelse: ret_beskrivelse }).then(i => {
                    return res.status(200).send({ message: 'ok', error: false })
                })
            }
        })
    }

    if (lille == "image/png" || lille == "image/jpeg" || lille == "image/jpg" || lille == "image/bmp") {

        billede.mv('./public/aftensmad/' + billedeNavn);

        opret(billedeNavn)

    } else if (lille == "fisse") {
        opret(billedeNavn)
    } else {
        res.send({
            error: true,
            message: lille
        });
    }

}

module.exports = {
    nyRet
};