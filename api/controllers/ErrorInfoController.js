module.exports = {
	forbidden403: function(req, res) {
		res.view({
			pagetitle: 'Forbidden',
			metaDescription: 'Forbidden',
			pageActiveName: ''
		})
	},
	notFound404: function(req, res) {
		res.view({
			pagetitle: 'Not Found',
			metaDescription: 'Not Found',
			pageActiveName: ''
		})
	},
	error500: function(req, res) {
		res.view({
			pagetitle: 'Error',
			metaDescription: 'Error',
			pageActiveName: ''
		})
	}
}
