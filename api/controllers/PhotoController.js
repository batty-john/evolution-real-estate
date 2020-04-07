module.exports = {
	get: function(req, res) {
		var promise = Data.photo();
		promise.then(photos => {
            console.log(photos);
			return res.json(photos);
		}).catch(err => {
            console.log(err);
			return res.status(500).send(err);
		});
	}
};