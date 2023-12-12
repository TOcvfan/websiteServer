const handleKm = (req, res, knexDb) => {
    const { id } = req.params;
    const {km_start, km_slut, km, start_by, slut_by, dato, bil} = req.body;
    if(!km_start || !km_slut || !km || !start_by || !slut_by || !id || !bil || !dato ){
        return res.status(401).send('fields not sent');
        }
        knexDb.insert({
            user_id: id,
            km_start: km_start,
            km_slut: km_slut,
            km: km,
            start_by: start_by,
            slut_by: slut_by,
            dato: dato,
            bil: bil
        })
        .into('kmliste')
		.then(km => {
			res.json('success');
			})
		.then(knexDb.commit)
		.catch(knexDb.rollback)

	.catch(err => res.status(400).json('unable to register ' + err))
}
    
module.exports = {
    handleKm
};