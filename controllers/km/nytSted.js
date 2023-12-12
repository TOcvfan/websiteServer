const handleNytSted = (req, res, knexDb) => {
    const {navn, adresse, post, by} = req.body;
    if(!adresse || !post || !by){
        return res.status(401).send('fields not sent');
        }
        knexDb.insert({
            navn: navn,
            adresse: adresse,
            by: by,
            post: post
        })
        .into('byer')
		.then(by => {
			res.json('success');
			})
		.then(knexDb.commit)
		.catch(knexDb.rollback)

	.catch(err => res.status(400).json('det var ikke muligt at tilføje stedet ' + err))
}
    
module.exports = {
    handleNytSted
};