const handleDelKm = (req, res, knexDb) => {
	const { id } = req.params;
	knexDb('kmliste')
    .where('user_id', id)
    .del().then(function (count) {
        res.send({'msg':'list removed'});
      });
}

module.exports = {
	handleDelKm
};