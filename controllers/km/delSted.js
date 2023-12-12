const handleFjernBy = (req, res, knexDb) => {
	const { id } = req.params;
	knexDb('byer')
    .where('id', id)
    .del().then(function (count) {
        res.send({'msg':'sted fjernet'});
      });
}

module.exports = {
	handleFjernBy
};