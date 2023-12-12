const handleAlarm = (req, res, knexDb) => {
    const { id } = req.params;
    const { alarmer, minus } = req.body;
    if(!alarmer || !id){
        return res.status(401).send('fields not sent');
        }
        if(minus === true){
            knexDb('alarm_login').where('id', '=', id)
                .decrement('alarmer', alarmer)
                .then(() => 
            knexDb('alarm_login').where('id', '=', id).then(nyalarm => res.json(nyalarm[0].alarmer))
            )
            .catch(err => res.status(401).json('unable to get entries ' + err))
        }else{
            knexDb('alarm_login').where('id', '=', id)
                .increment('alarmer', alarmer)
                .then(() => 
            knexDb('alarm_login').where('id', '=', id).then(nyalarm => res.json(nyalarm[0].alarmer))
            )
            .catch(err => res.status(401).json('unable to get entries ' + err))
            
        }
        
    }
    
module.exports = {
    handleAlarm
};