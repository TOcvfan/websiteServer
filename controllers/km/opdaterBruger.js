const handleOpdBruger = (req, res, knexDb) => {
    const { id } = req.params;
    const { role, email, brugernavn, mellemnavn, initialer, telefon, skadeservice } = req.body;
    if(!role || !email || !brugernavn || !mellemnavn || !initialer || !telefon || !skadeservice || !id){
        return res.status(401).send('fields not sent');
        }
        knexDb('alarm_login').where('id', '=', id)
            .then(() => 
            knexDb('alarm_login').where('id', '=', id).then(nyalarm => res.json(nyalarm[0].alarmer))
            )
            .catch(err => res.status(401).json('unable to get entries ' + err))
        }
    
module.exports = {
    handleOpdBruger
};