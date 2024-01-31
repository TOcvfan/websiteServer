const nytBillede = (req, res, knex, dotenv, fileName, table) => {
    dotenv.config();
    const { navn } = req.body;
    const where = table === "opskrift" ? 'titel' : 'navn';
    let billedeNavn = 0;
    let lille = "fisse"

    const { billede } = req.files ? req.files : false

    if (billede) {
        lille = billede.mimetype.toLowerCase();
        const billedetype = billede.name.split('.')[1]
        const retNavnNoSpace = navn.replace(/\s/g, '');
        const retNavnO = retNavnNoSpace.replace(/[ø]/g, 'o');
        const retNavnAA = retNavnO.replace(/[å]/g, 'aa');
        const retNavnae = retNavnAA.replace(/[æ]/g, 'ae');
        const img = fileName + retNavnae + '.' + billedetype;
        billedeNavn = img.toLowerCase()
    }
    const opret = (billede) => {
        knex(table).where(where, navn).update({ billede }).then((nytBillede) => {
            res.send({ message: nytBillede + ' lagt op', error: false });
        }).catch(err => {
            res.status(404).json({ message: err + ' noget gik galt', error: true })
        })
    }

    if (lille == "image/png" || lille == "image/jpeg" || lille == "image/jpg" || lille == "image/bmp") {

        billede.mv('./public/aftensmad/' + billedeNavn);

        opret(billedeNavn)

    } else if (lille == "fisse") {
        res.send({
            error: true,
            message: 'du mangler et billede'
        });
    } else {
        res.send({
            error: true,
            message: lille
        });
    }

}

module.exports = {
    nytBillede
};